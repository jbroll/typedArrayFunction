/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*jshint node: true, -W099: true, laxbreak:true, laxcomma:true, multistr:true, smarttabs:true */
/*globals */ 

"use strict";

(function() {

    function replaceIdentifierRefs(str, func) {
	var reply = "";

	var state = -1, match, index, first, i = 0;

	while ( i < str.length ) {
	    match = str.match(/[a-zA-Z_][a-zA-Z0-9_]*/);		// Find an identifier in the string.

	    if ( !match ) { break; }

	    index = [];
	    i     = match.index + match[0].length;

	    state = 0;

	    while ( i < str.length ) {
		if ( str[i] === ']' ) {
		    state--;

		    if ( state === 0 ) {
			index.push(str.substring(first, i)); 
		    }
		} else {
		    if ( state === 0 ) {
			if ( str[i] === '[' ) {
			    first = i+1;
			    state++;
			}
			if ( str[i] !== ' ' && str[i] !== '[' ) {
			    break;
			}
		    } else {
			if ( str[i] === '[' ) { state++; }
		    }
		}
		i++;
	    }

	    reply += str.substr(0, match.index) + func(match[0], index);
	    str    = str.substr(i);
	    i = 0;
	}

	return reply + str.substr(i);
    }


    function typedArrayFunctionConstructor() {
        var i;
        var actuals = arguments;
	var hash = {};
	var dims = [];
	var indicies = [ "iW", "iV", "iU", "iZ", "iY", "iX" ];

	var text = this.func.toString();

	var x = text.match(/function \(([^()]*)\)[^]*{([^]*)}[^]*/);

	var args = x[1].split(",").map(function(s) { return s.trim(); });
	var body = x[2].split("// ----+");
	var prep = "", post = "";

	if ( body.length > 1 ) {
	    prep = body[0];
	    post = body[2];
	    body = body[1];
	} else {
	    body = body[0];
	}

	// Capture the function parameter names and place them in the 
	// hash table with corrosponding real function arguments.
	//
	var type = ""
	for ( i = 0; i < args.length; i++ ) {
	    hash[args[i]] = actuals[i];
	    type += "// var " + args[i] + " " + actuals[i].dtype + "\n"
       	}

	// Match each source code identifier and any associated array indexing.  Extract
	// the indicies and recursivly replace them also.
	//
	function ReplaceArrayRefs(text) {
	    return replaceIdentifierRefs(text, function (id, indx) {
		var i, indx = [], state = 0, offset;

		for ( i = 0; i < indx.length; i++ ) {
		    indx[i] = ReplaceArrayRefs(indx[i]);
		}

		var arg = hash[id];

		if ( arg && arg.data ) {

		    indi = indicies.slice(6-arg.dimension);

		    id = id + ".data";
		    for ( i = 0; i < arg.dimension; i++ ) {
		    	if ( indx[i] === undefined ) { indx[i] = indi[i]; } 
			if ( dims[i] === undefined ) { dims[i] = 0; }

			dims[i] = Math.max(dims[i], arg.shape[i]);
		    }
		    for ( i = 0; i < arg.dimension; i++ ) {
			if ( arg.stride[i] !== 1 ) { indx[i] =  "(" + indx[i] + ")*" + arg.stride[i]; }
		    }

		    if ( arg.offset !== 0 ) { 	offset = arg.offset + " + "; 
		    } else {			offset = "" }

		    return id + "[" + offset + indx.join(" + ") + "]";
		} else {
		    return id;
		}

	    });
	}
	body = ReplaceArrayRefs(body);

	var indi = indicies.slice(6-dims.length).reverse();

	for ( i = 0; i < dims.length; i++ ) {
	    body = "for ( var " + indi[i] + " = 0; " + indi[i] + " < " + dims[i] + "; " + indi[i] + "++ ) {\n    " + body + "\n    }";
	}

	var func;

	func  = "// Array optimized funciton\n";
	func += type
	func += "return function (" + args.join(",") + ") {\n'use strict';\n\n" + prep + body + post + "\n}";

	if ( this.cache       === undefined ) { this.cache = {}; }
	if ( this.cache[func] === undefined ) {
	     console.log(func);
	     this.cache[func] = new Function(func)();
	}

	this.cache[func].apply(undefined, arguments);
    }

    module.exports = function (func) { return typedArrayFunctionConstructor.bind({ func: func }); };
}());

