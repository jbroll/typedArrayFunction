/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*jshint node: true, -W099: true, laxbreak:true, laxcomma:true, multistr:true, smarttabs:true */
/*globals Float32Array, Int32Array */ 

"use strict";

var ndarray = require("ndarray");
var ndops   = require("ndarray-ops");
var tyops   = require("./ndarray-ops-typed");

var typed   = require("./typedArrayFunction");

var size = 2048;

var a = ndarray(new Int32Array(size*size),   [size, size]);
var b = ndarray(new Int32Array(size*size),   [size, size]);
var c = ndarray(new Int32Array(size*size),   [size, size]);
var d = ndarray(new Float32Array(size*size), [size, size]);


//ndops.addseq(a, 1);
//tyops.addeq(b, 1);
//console.log(ndops.equals(a, b));


for ( var i = 0; i < 1000; i++ ) {
    tyops.cos(a, b, c);
    tyops.add(a, b, d);
}

