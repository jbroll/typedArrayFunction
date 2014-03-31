/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*jshint node: true, -W099: true, laxbreak:true, laxcomma:true, multistr:true, smarttabs:true */
/*globals */ 

"use strict";

(function() {
    var numeric = {};

    numeric._dim = function _dim(x) {
	var ret = [];
	while(typeof x === "object") { ret.push(x.length); x = x[0]; }
	return ret;
    };

    function replaceIdentifierRefs(str, func) {
	var reply = "";

	var state = -1, match, index, first, i = 0, x;

	while ( i < str.length ) {
	    match = str.match(/[a-zA-Z_][a-zA-Z0-9_]*/);		// Find an identifier in the string.

	    if ( !match ) { break; }

	    reply += str.substr(i, match.index);

	    index = [];
	    i     = match.index + match[0].length;

	    x = true;
	    while ( x && i < str.length ) {
		while ( str[i] === ' ' ) { i++; }

		switch ( str[i] ) {
		 case "[": 
		    state = 1;
		    first = i+1;
		    i++;

		    while ( state ) {
			if ( str[i] === ']' ) {
			    if ( state === 1 ) {
				index.push(str.substring(first, i)); 
			    }
			    state--;
			}
			if ( str[i] === '[' ) {
			    state++;
			    first = i+1;
			}
			i++;
		    }
		    break;
		 default: 
		    x = false;
		    break;
		}
	    }

	    reply += func(match[0], index);
	    str    = str.substr(i);
	    i = 0;
	}


	return reply + str.substr(i);
    }


    function typedArrayFunctionConstructor() {
        var i, text;
        var actuals = arguments;
	var hash = {};
	var star = [];
	var dims = [];
	var indicies = [ "iW", "iV", "iU", "iZ", "iY", "iX" ];

	if ( typeof this.func === "string" ) {
	    text = this.func;
	} else {
	    text = this.func.toString();
	}

	var consider = this.consider;

	var x = text.match(/function \(([^()]*)\)[^{]*{([^]*)}[^]*/);

	var args = x[1].split(",").map(function(s) { return s.trim(); });
	var body = x[2].split(/\/\/ ----+/);
	var prep = "", post = "";

	if ( body.length > 1 ) {
	    prep = body[0];
	    post = body[2];
	    body = body[1];
	} else {
	    body = body[0];
	    post = "\nreturn " + args[0] + ";";
	}

	// Capture the function parameter names and place them in the 
	// hash table with corrosponding real function arguments.
	//
	var type = "";
	for ( i = 0; i < args.length; i++ ) {
	    hash[args[i]] = actuals[i];

	    if ( typeof actuals[i] === "object" && !actuals[i].shape && (!consider || consider && consider[args[i]] ) ) {
		actuals[i].shape = numeric._dim(actuals[i]);
	    }
	    type += "// var " + args[i] + " " + actuals[i].dtype + " " + actuals[i].offset + " " + actuals[i].shape + " " + actuals[i].stride + "\n";
       	}

	// Match each source code identifier and any associated array indexing.  Extract
	// the indicies and recursivly replace them also.
	//
	function replaceArrayRefs(text) {
	    return replaceIdentifierRefs(text, function (id, indx) {
		var i, offset, reply;

		for ( i = 0; i < indx.length; i++ ) {
		    indx[i] = replaceArrayRefs(indx[i]);
		}


		var arg = hash[id];
		var dimen;
		var joinStr;

		if ( arg && typeof arg === "object" && (!consider || ( consider && consider[args[i]] )) ) {

		    if ( arg.data ) {
			dimen = arg.dimension;

			id = id + ".data";
			for ( i = 0; i < arg.dimension; i++ ) {
			    if ( arg.stride[i] !== 1 ) { indx[i] =  "(" + indx[i] + ")*" + arg.stride[i]; }
			}
			if ( arg.offset !== 0 ) { 	offset = arg.offset + " + "; 
			} else {			offset = ""; }

			joinStr = " + ";
		    } else {
			dimen = arg.shape.length;
			joinStr = "][";
		    }

		    var indi = indicies.slice(6-dimen);

		    for ( i = 0; i < dimen; i++ ) {
		    	if ( indx[i] === undefined ) { indx[i] = indi[i]; } 
			if ( dims[i] === undefined ) { dims[i] = 0; }

			dims[i] = Math.max(dims[i], arg.shape[i]);
		    }

		    reply = id + "[" + offset + indx.join(joinStr) + "] ";
		} else {
		    if ( indx.length > 0 ) {
			reply = id + "[" + indx.join("][") + "] ";
		    } else {
			reply = id + " ";
		    }
		}
		
		return reply;
	    });
	}
	var brak = body.match(/\/\/ *\[(.*)\]/);

	body = replaceArrayRefs(body);
	star = dims.map(function (x) { return 0; });

	if ( brak !== null ) {
	    brak = brak[1].replace(/\]\[/, " ").split(" ").map(function (x) { return x.split(":").map(function (n) { return parseInt(n, 10); }); });
	    for ( i = 0; i < brak.length; i++ ) {
		star[i] = brak[i][0];
		dims[i] = brak[i][1] + dims[i];
	    }
	}

	var indi = indicies.slice(6-dims.length).reverse();
	dims.reverse();

	for ( i = 0; i < dims.length; i++ ) {
	    body = "for ( var " + indi[i] + " = " + star[i] + "; " + indi[i] + " < " + dims[i] + "; " + indi[i] + "++ ) {\n    " + body + "\n    }";
	}

	var func;

	func  = "// Array optimized funciton\n";
	func += type;
	func += "return function (" + args.join(",") + ") {\n'use strict';\n\n" + prep + body + post + "\n}";

	if ( this.cache       === undefined ) { this.cache = {}; }
	if ( this.cache[func] === undefined ) {
	     console.log(func);
	     this.cache[func] = new Function(func)();
	}

	return this.cache[func].apply(undefined, arguments);
    }

    module.exports = function (func, opts) { return typedArrayFunctionConstructor.bind({ func: func, opts: opts }); };
}());

