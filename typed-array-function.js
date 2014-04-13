/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*jshint node: true, -W099: true, laxbreak:true, laxcomma:true, multistr:true, smarttabs:true */
/*globals */ 

"use strict";

(function() {
    var ndarray = require("ndarray");

    var types = {
	    int8  :   Int8Array
	  , uint8 :  Uint8Array
	  , int16 :  Int16Array
	  , uint16:  Uint16Array
	  , int32:   Int32Array
	  , uint32:  Uint32Array
	  , float32: Float32Array
	  , float64: Float64Array
    };

    function clone (x) {
	return typed.assign(typed.array(typed.dim(x), x), x);
    }

    function iota(n) {
	var result = new Array(n)
	    for(var i=0; i<n; ++i) {
	    result[i] = i
	}   
	return result
    }

    function repeat(pattern, count) {
	if (count < 1) return '';
	var result = '';
	while (count > 0) {
	    if (count & 1) result += pattern;
	    count >>= 1, pattern += pattern;
	}
	return result;
    }


    function dim(x) {
    	if ( x.shape ) { return x.shape };

	var ret = [];
	while(typeof x === "object") { ret.push(x.length); x = x[0]; }
	return ret;
    };

    function extend(){
	for(var i=1; i<arguments.length; i++) {
	    for(var key in arguments[i]) {
		if(arguments[i].hasOwnProperty(key)) {
		    arguments[0][key] = arguments[i][key];
		}
	    }
	}
	return arguments[0];
    }

    function rep(s,v,k) {
	if(v === undefined ) { v = 0; }
	if(typeof k === "undefined") { k=0; }
	var n = s[k], ret = Array(n), i;
	if(k === s.length-1) {
	    for(i=n-2;i>=0;i-=2) { ret[i+1] = v; ret[i] = v; }
	    if(i===-1) { ret[0] = v; }
	    return ret;
	}
	for(i=n-1;i>=0;i--) { ret[i] = rep(s,v,k+1); }
	return ret;
    }
    function print(a, width, prec) {
	var x, y;
	var line;

	if ( width === undefined ) { width = 7; }
	if ( prec === undefined  ) { prec  = 3; }

	if ( a.shape.length === 1 ) {
	    line = "";
	    for (x=0;x<a.shape[0];++x) {
		line += a.get(x).toFixed(prec) + " ";
		//if ( x > 17 ) { break;}
	    }
	    console.log(line);
	} else {
	    for ( y = a.shape[0]-1; y >= 0; --y ) {
	      line = "";
	      for ( x = 0; x < a.shape[1]; ++x ) {
		line += a.get(y, x).toFixed(prec) + " ";
	      }

	      console.log(line);
	    }
	    console.log("\n");
	}
    };

    function section(a, sect) {
	    var x1 = sect[0][0];
	    var x2 = sect[0][1];
	    var y1 = sect[1][0];
	    var y2 = sect[1][1];

	    return a.lo(y1, x1).hi(y2-y1, x2-x1);
    };


    function array(shape, dtype, value) {
        var reply;
	var i, n;

	if ( typeof value !== "number" ) {
	    value = 0;
	}

	if ( dtype && dtype.dtype ) 	 { dtype = dtype.dtype;  }
	if ( typeof dtype === "string" ) { dtype = types[dtype]; }

        if ( typeof dtype === "function" ) {
	    n = size(shape);
	    reply = ndarray(new dtype(n), shape);

	    for ( i = 0; i < n; i++ ) { reply.data[i] = value; }
	} else {
	    reply = rep(shape, value);
	}

	reply.shape = shape;

	return reply;
    }

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
			    if ( state === 1 ) { index.push(str.substring(first, i)); }
			    state--;
			}
			if ( str[i] === '[' ) {
			    state++;
			    first = i+1;
			}
			i++;
		    }
		    break;
		 case "." : 
		    first = i;
		    i++;
		    while ( str[i] === ' ' ) { i++; }
		    while ( str[i].match(/[ a-zA-Z0-9_]/) !== null ) { i++; }

		    index.push(str.substring(first, i));

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
        var actuals = arguments;
	var i, j;
	var args;
	var text;
	var hash = {}

	var body;

	if ( this.cache === undefined ) {
	    if ( typeof this.func === "string" ) {
		text = this.func;
	    } else {
		text = this.func.toString();
	    }
	    this.text = text;

	    var x = text.match(/function [A-Za-z0-9_]*\(([^()]*)\)[^{]*{([^]*)}[^]*/);	// }

	    args = x[1].split(",").map(function(s) { return s.trim(); });
	    this.args = args;

	    this.prep = "";
	    this.post = "";

	    body = x[2].split(/\/\/ ----+/);

	    if ( body.length > 1 ) {
		this.prep = body[0];
		this.post = body[2];
		this.body = body[1];
	    } else {
		this.body = body[0];
	    }
	    if ( this.post === "" || this.post === undefined ) {
		this.post = "\nreturn " + args[0] + ";";
	    }
	} 
	args = this.args;
	text = this.text;

	var opts = this.opts;

	if ( opts === undefined ) { opts = {} };

	// Capture the function parameter names and place them in the 
	// hash table with corrosponding real function arguments.
	//
	var type = "";
	var dime = 0

	for ( i = 0; i < args.length; i++ ) {

	    if ( typeof actuals[i] === "object" && (!opts.consider || opts.consider && opts.consider[args[i]] ) ) {
		if ( !actuals[i].shape ) {
		    actuals[i].shape = dim(actuals[i]);
		}

		dime = Math.max(actuals[i].shape.length, dime);

		if ( actuals[i].data ) {
		    type += " " + actuals[i].dtype + " " + actuals[i].offset + " " + " " + actuals[i].stride;
		} else {
		    type += " O";
		}

	    } else {
		type += " X";
	    }
       	}
	type = dime + type;

	if ( this.cache ) {
	    func = this.cache[type]
	    if ( func ) {
		return func;
	    }
	}

	for ( i = 0; i < args.length; i++ ) {
	    hash[args[i]] = actuals[i];

	    if ( typeof actuals[i] === "object" && !actuals[i].shape && (!opts.consider || opts.consider && opts.consider[args[i]] ) ) {
		actuals[i].shape = dim(actuals[i]);
	    }
	}


	var prep = this.prep;
	var body = this.body;
	var post = this.post;
	var star = [];
	var dims = [];

	var indicies = [ "iW", "iV", "iU", "iZ", "iY", "iX" ];

	// Match each source code identifier and any associated array indexing.  Extract
	// the indicies and recursivly replace them also.
	//
	function replaceArrayRefs(text) {
	    return replaceIdentifierRefs(text, function (id, indx) {
		var ID = id;
		var i, offset, reply;

		for ( i = 0; i < indx.length; i++ ) {
		    indx[i] = replaceArrayRefs(indx[i]);
		}

		var arg = hash[id];
		var dimen;
		var joinStr, bracket, fixindx;

		if ( arg && typeof arg === "object" && (!opts.consider || ( opts.consider && opts.consider[id] )) ) {

		    if ( indx.length >= 1 && indx[indx.length-1].trim() === ".length" ) {
		        indx[0] = ".shape";
			indx[1] = indx.length-1;
			indx.length = 2;
		    }

		    if ( indx.length >= 1 && indx[0][0] === "." ) {
		        if ( indx.length >= 2 && indx[0].trim() === ".shape" ) {
			    if ( arg.data ) {
				reply = id + ".shape[" + indx[1] + "]";
			    } else {
				reply = id + repeat("[0]", indx[1]) + ".length";
			    } 
			} else {
			    reply = id + indx[0].trim();
			}
		    } else {
			if ( arg.data ) {
			    dimen = arg.dimension;


			    if ( indx.length !== 0 && indx.length < arg.dimension ) {
				id = id + ".data.subarray";
				bracket = "()";
				fixindx = indx.length;
			    } else {
				id = id + ".data";
				bracket = "[]"
				fixindx = arg.dimension;
			    }

			    joinStr = " + ";
			} else {
			    dimen = arg.shape.length;
			    joinStr = "][";
			    offset  = ""
			    bracket = "[]"
			}

			var indi = indicies.slice(6-dimen);

			if ( ( opts.loops === undefined || opts.loops == true ) && indx.length === 0 || dimen === indx.length ) {
			    for ( i = 0; i < dimen; i++ ) {
				if ( indx[i] === undefined ) { indx[i] = indi[i]; } 
				if ( dims[i] === undefined ) { dims[i] = 0; }

				dims[i] = Math.max(dims[i], arg.shape[i]);
			    }
			}

			if ( arg.data ) {
			    for ( i = 0; i < fixindx; i++ ) {
				if ( arg.stride[i] !== 1 ) { indx[i] =  "(" + indx[i] + ")*" + arg.stride[i]; }
			    }

			    if ( arg.offset !== 0 ) { 	offset = arg.offset + " + ";
			    } else {			offset = ""; }
			}

			if ( indx.length ) {
			    reply = id + bracket[0] + offset + indx.join(joinStr) + bracket[1] + " ";
			} else {
			    reply = id;
			}
		    }
		} else {
		    if ( indx.length > 0 ) {
			if ( indx[0][0] === "." ) {
			    reply = id + indx[0].trim();
			} else {
			    reply = id + "[" + indx.join("][") + "] ";
			}
		    } else {
			reply = id + " ";
		    }
		}
		
		return reply;
	    });
	}
	var brak = body.match(/\/\/ *\[(.*)\]/);
	if ( brak !== null ) {
	    brak = brak[1].replace(/\]\[/, " ").split(" ").map(function (x) { return x.split(":").map(function (n) { return parseInt(n, 10); }); });
	} else {
	    brak = [];
	}

	body = replaceArrayRefs(body);
	star = dims.map(function (x) { return 0; });


	var indx = indicies.slice(6-dims.length);
	var indi = indicies.slice(6-dims.length).reverse();
	dims.reverse();

	var init = "\n", j;

	if ( opts.loops === undefined || opts.loops == true ) {
	    for ( i = 0; i < dims.length; i++ ) {

		init += "	var " + indx[i] + "star = 0;\n"
		init += "	var " + indx[i] + "dims = 0;\n"
		for ( j = 0; j < args.length; j++ ) {
		    if ( typeof actuals[j] === "object" && (!opts.consider || ( opts.consider && opts.consider[args[j]] )) ) {
			init += "	" + indx[i] + "dims = Math.max(" + args[j] + ".shape[" + i + "], " + indx[i] + "dims);\n"
		    }
		}
		if ( brak[i] ) {
		    init += "	" + indi[i] + "star += " + brak[i][0] + ";\n"
		    init += "	" + indi[i] + "dims += " + brak[i][1] + ";\n"
		}
		init += "\n"
	    }
	    for ( i = 0; i < dims.length; i++ ) {
		body = "for ( var " + indi[i] + " = " + indi[i] + "star; " + indi[i] + " < " + indi[i] + "dims; " + indi[i] + "++ ) {\n    " + body + "\n    }";
	    }
	}

	var func;

	func  = "// Array optimized funciton\n";
	func += "// " + type + "\n";
	func += "return function (" + args.join(",") + ") {\n'use strict';\n\n" + prep + init + body + post + "\n}";

	if ( this.cache       === undefined ) { this.cache = {}; }
	if ( this.cache[type] === undefined ) {
	     if ( typed.debug ) { console.log(func); }
	     func = new Function(func)();
	     this.cache[type] = func;
	}

	return func;
    }


    function typedArrayFunctionExecute() {
	var func = typedArrayFunctionConstructor.apply(this, arguments);

	return func.apply(typed, arguments);
    }

    function typed(opts, func) {
	if ( func === undefined ) {
	    func = opts;
	    opts = undefined;
	}
	var objst = { func: func, opts: opts };
	var reply = typedArrayFunctionExecute.bind(objst);

	reply.baked = typedArrayFunctionConstructor.bind(objst);

	return reply;
    };

    module.exports         = typed;
    module.exports.ndarray = ndarray;
    module.exports.section = section;
    module.exports.extend  = extend;
    module.exports.array   = array;
    module.exports.clone   = clone;
    module.exports.print   = print;
    module.exports.dim     = dim;

    module.exports.epsilon = 2.220446049250313e-16;

    var size = typed(function (a) {
	var prd = 1;
	// ----
	    prd *= a;
	// ----
	return prd;
    });

}());

