/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*globals */ 

"use strict";

(function () {
    var i;
    var typed = require("typed-array-function");

    var ops = {}, opname, op;
    module.exports = ops;

    function twofourthr(ops) {				// Allocate an output array as needed
        var dima, dimb, shape;

	return function (a, b, c) {
	    if ( c === undefined ) {
	 	dima = typed.dim(a);
	 	dimb = typed.dim(b);

		if ( dima.length > dimb.length ) {
		    shape = dima;
		} else {
		    shape = dimb;
		} 
	    	c = b; b = a; a = typed.array(shape, b);
	    }

	    return ops(a, b, c);
	};
    }
    function onefourtwo(ops) {				// Allocate an output array as needed
	return function (a, b) {
	    if ( b === undefined ) { b = a; a = typed.array(typed.dim(b), b); }

	    return ops(a, b);
	};
    }

    function twofourthr_bake(op) {
	return function(a, b, c) {
	    if ( c === undefined )  { return twofourthr(op.baked(a, b, c)); }

	    return op.baked(a, b, c);
	};
    }
    function onefourtwo_bake(op) {
	return function(a, b) {
	    if ( b === undefined )  { return onefourtwo(op.baked(a, b)); }

	    return op.baked(a, b);
	};
    }


    var assign_ops = { add:  "+", sub:  "-", mul:  "*", div:  "/",
		       mod:  "%", band: "&", bor:  "|", bxor: "^",
		       lshift: "<<", rshift: ">>", rrshift: ">>>"
    };

      for(opname in assign_ops) {
	if ( assign_ops.hasOwnProperty(opname) ) {
	    op = assign_ops[opname];

	    ops[opname + "3"]       = typed("function (a, b, c)    {            a = b " + op + " c; }");
	    ops[opname + "_mask"]   = typed("function (a, b, c, m) { if ( m ) { a = b " + op + " c; } }");
	    ops[opname + "eq"]      = typed("function (a, b   )    {            a " + op + "= b;    }  ");
	    ops[opname + "eq_mask"] = typed("function (a, b   , m) { if ( m ) { a " + op + "= b;    } }");

	    ops[opname]       = twofourthr     (ops[opname + "3"]);
	    ops[opname].baked = twofourthr_bake(ops[opname + "3"]);

	    ops[opname + "s"]   = ops[opname];
	    ops[opname + "seq"] = ops[opname + "eq"];
	}
      }

    var binary_ops = { and: "&&", or: "||",
		       eq: "===", neq: "!==", lt: "<",
		       gt: ">", leq: "<=", geq: ">=" };

      for(opname in binary_ops) {
	if ( binary_ops.hasOwnProperty(opname) ) {
	    op = binary_ops[opname];

	    ops[opname + "3"]            = typed("function (a, b, c)    {            a = b " + op + " c; }");
	    ops[opname + "_mask"]        = typed("function (a, b, c, m) { if ( m ) { a = b " + op + " c; } }");
	    ops[opname + "eq"]           = typed("function (a, b   )    {            a = a " + op + " b; }  ");
	    ops[opname + "eq_mask"]      = typed("function (a, b   , m) { if ( m ) { a = a " + op + " b; } }");

	    ops[opname]       = twofourthr     (ops[opname + "3"]);
	    ops[opname].baked = twofourthr_bake(ops[opname + "3"]);

	    ops[opname + "s"]   = ops[opname];
	    ops[opname + "seq"] = ops[opname + "eq"];
	}
      }


    var unary_ops = { not: "!", bnot: "~", neg: "-", recip: "1.0/" };

      for(opname in unary_ops) {
	if ( unary_ops.hasOwnProperty(opname) ) {
	    op = unary_ops[opname];
		
	    ops[opname + "2"]            = typed("function (a, b   )    {            a = " + op + " b; }");
	    ops[opname + "_mask"]        = typed("function (a, b   , m) { if ( m ) { a = " + op + " b; } }");
	    ops[opname + "eq"]           = typed("function (a      )    {            a = " + op + " a; }");
	    ops[opname + "eq" + "_mask"] = typed("function (a      , m) { if ( m ) { a = " + op + " a; } }");

	    ops[opname]       = onefourtwo     (ops[opname + "2"]);
	    ops[opname].baked = onefourtwo_bake(ops[opname + "2"]);
	}
      }

    var math_unary = [ "Math.abs", "Math.exp", "Math.floor", "Math.log", "Math.round", "Math.sqrt"
		    , "Math.acos", "Math.asin", "Math.atan", "Math.ceil", "Math.cos", "Math.sin", "Math.tan"
		    , "isFinite", "isNaN" ]; 

      for( i = 0; i < math_unary.length; i++ ) {
	    opname = op = math_unary[i];
		
	    ops[opname + "2"]            = typed("function (a, b   )    {            a = " + op + "(b); }");
	    ops[opname + "_mask"]        = typed("function (a, b   , m) { if ( m ) { a = " + op + "(b); } }");
	    ops[opname + "eq"]           = typed("function (a      )    {            a = " + op + "(a); }");
	    ops[opname + "eq" + "_mask"] = typed("function (a      , m) { if ( m ) { a = " + op + "(a); } }");

	    ops[opname]       = onefourtwo     (ops[opname + "2"]);
	    ops[opname].baked = onefourtwo_bake(ops[opname + "2"]);
      }

    var math_comm = [ "max", "min" ];

      for( i = 0; i < math_comm.length; i++ ) {
	opname = op = math_comm[i];

	ops[opname + "3"]            = typed("function (a, b, c)    {            a = Math." + op + "(b, c); }");
	ops[opname + "_mask"]        = typed("function (a, b, c, m) { if ( m ) { a = Math." + op + "(b, c); } }");

	ops[opname]       = twofourthr     (ops[opname + "3"]);
	ops[opname].baked = twofourthr_bake(ops[opname + "3"]);

	ops[opname + "s"]        = ops[opname];
	ops[opname + "s" + "eq"] = ops[opname];
      }

    var math_noncomm = [ "atan2", "pow" ];

      for( i = 0; i < math_noncomm.length; i++ ) {
	opname = op = math_noncomm[i];

	ops[opname + "3"]            = typed("function (a, b, c)    {            a = Math." + op + "(b, c); }");
	ops[opname + "_mask"]        = typed("function (a, b, c, m) { if ( m ) { a = Math." + op + "(b, c); } }");

	ops[opname]       = twofourthr     (ops[opname + "3"]);
	ops[opname].baked = twofourthr_bake(ops[opname + "3"]);

	ops[opname + "s"]        = ops[opname];
	ops[opname + "s" + "eq"] = ops[opname];
      }

    ops.assign   = typed(function (a, b) { a = b; });
    ops.equals   = typed(function (a, b) { if ( a !== b )   { return false; } });
    ops.any      = typed(function (a) { if ( a )            { return true;  } });
    ops.all      = typed(function (a) { if (!a )            { return false; } });
    ops.random   = typed(function (a)    { a = Math.random(); });
    ops.sum  = typed(function (a) {
	var sum = 0; 
	// ----
	    sum += a;
	// ----
	return sum;
    });
    ops.prod = typed(function (a) {
	var prd = 1;
	// ----
	    prd *= a;
	// ----
	return prd;
    });

    ops.inf  = typed(function (a) {
	var inf =  Infinity;
	// ----
	    if ( a < inf ) { inf = a; }
	// ----
	return inf;
    });
    ops.sup  = typed(function (a) {
	var sup = -Infinity;
	// ----
	    if ( a > sup ) { sup = a; }
	// ----
	return sup;
    });


    ops.norm2Squared = typed(function (a) {
	var norm2 = 0;
	// ----    
	    norm2 += a*a;
	// ----    
	return norm2;
    });
    ops.norm2 = function (a) { return Math.sqrt(ops.norm2Squared(a)); };

	//norm1
	//norminf

	//argmin
	//argmax

}());
 
