/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*jshint node: true, -W099: true, laxbreak:true, laxcomma:true, multistr:true, smarttabs:true */
/*globals */ 

"use strict";

(function () {
    var i;
    var typedArrayFunction = require("./typedArrayFunction");

    var ops = {}, op;
    module.exports = ops;

    var assign_ops = { add:  "+", sub:  "-", mul:  "*", div:  "/",
		       mod:  "%", band: "&", bor:  "|", bxor: "^",
		       lshift: "<<", rshift: ">>", rrshift: ">>>"
    };

      for(var opname in assign_ops) {
	op = assign_ops[opname]

	ops[opname]                  = typedArrayFunction(new Function("return function (a, b, c)    {            a = b " + op + " c; }")());
	ops[opname + "_mask"]        = typedArrayFunction(new Function("return function (a, b, c, m) { if ( m ) { a = b " + op + " c; } }")());
	ops[opname + "eq"]           = typedArrayFunction(new Function("return function (a, b   )    {            a " + op + "= b;    }")());
	ops[opname + "eq" + "_mask"] = typedArrayFunction(new Function("return function (a, b   , m) { if ( m ) { a " + op + "= b;    } }")());
      }


    var unary_ops = { not: "!", bnot: "~", neg: "-", recip: "1.0/" };

      for(var opname in unary_ops) {
	op = unary_ops[opname]
	    
	ops[opname]                  = typedArrayFunction(new Function("return function (a, b   )    {            a = " + op + " b; }")());
	ops[opname + "_mask"]        = typedArrayFunction(new Function("return function (a, b   , m) { if ( m ) { a = " + op + " b; } }")());
	ops[opname + "eq"]           = typedArrayFunction(new Function("return function (a      )    {            a = " + op + " a; }")());
	ops[opname + "eq" + "_mask"] = typedArrayFunction(new Function("return function (a      , m) { if ( m ) { a = " + op + " a; } }")());
      }


    var binary_ops = { and: "&&", or: "||",
		       eq: "===", neq: "!==", lt: "<",
		       gt: ">", leq: "<=", geq: ">=" };

      for(var opname in binary_ops) {
	op = binary_ops[opname]

	ops[opname]                  = typedArrayFunction(new Function("return function (a, b, c)    {            a = b " + op + " c; }")());
	ops[opname + "_mask"]        = typedArrayFunction(new Function("return function (a, b, c, m) { if ( m ) { a = b " + op + " c; } }")());
      }
	    
    var math_unary = [ "abs", "acos", "asin", "atan", "ceil", "cos", "exp", "floor", "log", "round", "sin", "sqrt", "tan" ];

      for( i = 0; i < math_unary.length; i++ ) {
	opname = op = math_unary[i]
	    
	ops[opname]                  = typedArrayFunction(new Function("return function (a, b   )    {            a = Math." + op + "(b); }")());
	ops[opname + "_mask"]        = typedArrayFunction(new Function("return function (a, b   , m) { if ( m ) { a = Math." + op + "(b); } }")());
	ops[opname + "eq"]           = typedArrayFunction(new Function("return function (a      )    {            a = Math." + op + "(a); }")());
	ops[opname + "eq" + "_mask"] = typedArrayFunction(new Function("return function (a      , m) { if ( m ) { a = Math." + op + "(a); } }")());
      }

    var math_comm = [ "max", "min", "atan2", "pow" ];

      for( i = 0; i < math_comm.length; i++ ) {
	opname = op = math_comm[i]

	ops[opname]                  = typedArrayFunction(new Function("return function (a, b, c)    {            a = Math." + op + "(b, c); }")());
	ops[opname + "_mask"]        = typedArrayFunction(new Function("return function (a, b, c, m) { if ( m ) { a = Math." + op + "(b, c); } }")());
      }

    var math_noncomm = [ "atan2", "pow" ];

      for( i = 0; i < math_noncomm.length; i++ ) {
	opname = op = math_noncomm[i]

	ops[opname]                  = typedArrayFunction(new Function("return function (a, b, c)    {            a = Math." + op + "(b, c); }")());
	ops[opname + "_mask"]        = typedArrayFunction(new Function("return function (a, b, c, m) { if ( m ) { a = Math." + op + "(b, c); } }")());
      }
}());

