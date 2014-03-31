/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*jshint node: true, -W099: true, laxbreak:true, laxcomma:true, multistr:true, smarttabs:true */
/*globals */ 

"use strict";

(function () {
    var i;
    var typed = require("./typed-array");

    var ops = {}, opname, op;
    module.exports = ops;

    var assign_ops = { add:  "+", sub:  "-", mul:  "*", div:  "/",
		       mod:  "%", band: "&", bor:  "|", bxor: "^",
		       lshift: "<<", rshift: ">>", rrshift: ">>>"
    };

      for(opname in assign_ops) {
	op = assign_ops[opname];

	ops[opname]                  = typed("function (a, b, c)    {            a = b " + op + " c; }  ");
	ops[opname + "_mask"]        = typed("function (a, b, c, m) { if ( m ) { a = b " + op + " c; } }");
	ops[opname + "eq"]           = typed("function (a, b   )    {            a " + op + "= b;    }  ");
	ops[opname + "eq" + "_mask"] = typed("function (a, b   , m) { if ( m ) { a " + op + "= b;    } }");

	ops[opname + "s"]        = ops[opname];
	ops[opname + "s" + "eq"] = ops[opname];

      }


    var unary_ops = { not: "!", bnot: "~", neg: "-", recip: "1.0/" };

      for(opname in unary_ops) {
	op = unary_ops[opname];
	    
	ops[opname]                  = typed(new Function("return function (a, b   )    {            a = " + op + " b; }")());
	ops[opname + "_mask"]        = typed(new Function("return function (a, b   , m) { if ( m ) { a = " + op + " b; } }")());
	ops[opname + "eq"]           = typed(new Function("return function (a      )    {            a = " + op + " a; }")());
	ops[opname + "eq" + "_mask"] = typed(new Function("return function (a      , m) { if ( m ) { a = " + op + " a; } }")());

	ops[opname + "s"]        = ops[opname];
	ops[opname + "s" + "eq"] = ops[opname];
      }


    var binary_ops = { and: "&&", or: "||",
		       eq: "===", neq: "!==", lt: "<",
		       gt: ">", leq: "<=", geq: ">=" };

      for(opname in binary_ops) {
	op = binary_ops[opname];

	ops[opname]                  = typed(new Function("return function (a, b, c)    {            a = b " + op + " c; }")());
	ops[opname + "_mask"]        = typed(new Function("return function (a, b, c, m) { if ( m ) { a = b " + op + " c; } }")());
      }
	    
    var math_unary = [ "abs", "acos", "asin", "atan", "ceil", "cos", "exp", "floor", "log", "round", "sin", "sqrt", "tan" ];

      for( i = 0; i < math_unary.length; i++ ) {
	opname = op = math_unary[i];
	    
	ops[opname]                  = typed(new Function("return function (a, b   )    {            a = Math." + op + "(b); }")());
	ops[opname + "_mask"]        = typed(new Function("return function (a, b   , m) { if ( m ) { a = Math." + op + "(b); } }")());
	ops[opname + "eq"]           = typed(new Function("return function (a      )    {            a = Math." + op + "(a); }")());
	ops[opname + "eq" + "_mask"] = typed(new Function("return function (a      , m) { if ( m ) { a = Math." + op + "(a); } }")());

	ops[opname + "s"]        = ops[opname];
	ops[opname + "s" + "eq"] = ops[opname];
      }

    var math_comm = [ "max", "min", "atan2", "pow" ];

      for( i = 0; i < math_comm.length; i++ ) {
	opname = op = math_comm[i];

	ops[opname]                  = typed(new Function("return function (a, b, c)    {            a = Math." + op + "(b, c); }")());
	ops[opname + "_mask"]        = typed(new Function("return function (a, b, c, m) { if ( m ) { a = Math." + op + "(b, c); } }")());
      }

    var math_noncomm = [ "atan2", "pow" ];

      for( i = 0; i < math_noncomm.length; i++ ) {
	opname = op = math_noncomm[i];

	ops[opname]                  = typed(new Function("return function (a, b, c)    {            a = Math." + op + "(b, c); }")());
	ops[opname + "_mask"]        = typed(new Function("return function (a, b, c, m) { if ( m ) { a = Math." + op + "(b, c); } }")());
      }

    ops.any  = typed(function (a) { if ( a ) { return true;  } });
    ops.all  = typed(function (a) { if (!a ) { return false; } });
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



	//norm1
	//norm2
	//norminf

	//argmin
	//argmax

    ops.assign = typed(function (a, b) { a = b; });
    ops.equils = typed(function (a, b) { if ( a !== b ) { return false; } });
    ops.random = typed(function (a)    { a = Math.random(); });
    ops.isFinite = typed(function (a) { if ( !isFinite(a) ) { return false; } });
}());
 
