/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*jshint node: true, -W099: true, laxbreak:true, laxcomma:true, multistr:true, smarttabs:true */
/*globals Float32Array, Int32Array */ 


var ndarray = require("ndarray");
var ndops   = require("ndarray-ops");


var typedArrayFunction = require("./typedArrayFunction");

var ops = {};
var op;

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

  for(var opname in math_unary) {
    op = math_unary[opname]
	
    ops[opname]                  = typedArrayFunction(new Function("return function (a, b   )    {            a = Math." + op + "(b); }")());
    ops[opname + "_mask"]        = typedArrayFunction(new Function("return function (a, b   , m) { if ( m ) { a = Math." + op + "(b); } }")());
    ops[opname + "eq"]           = typedArrayFunction(new Function("return function (a      )    {            a = Math." + op + "(a); }")());
    ops[opname + "eq" + "_mask"] = typedArrayFunction(new Function("return function (a      , m) { if ( m ) { a = Math." + op + "(a); } }")());
  }

var math_comm = [ "max", "min", "atan2", "pow" ];
var math_noncomm = [ "atan2", "pow" ];


a = ndarray(new Int32Array(2048*2048), [2048, 2048]);
b = ndarray(new Int32Array(2048*2048), [2048, 2048]);
c = ndarray(new Int32Array(2048*2048), [2048, 2048]);
d = ndarray(new Float32Array(2048*2048), [2048, 2048]);

for ( var i = 0; i < 1000; i++ ) {
    ops.add(a, b, c);
    ops.add(a, b, d);
}

