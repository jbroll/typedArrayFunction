/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*jshint node: true, -W099: true, laxbreak:true, laxcomma:true, multistr:true, smarttabs:true */
/*globals Float32Array, Int32Array */ 

"use strict";

var ndarray = require("ndarray");
//var ndops   = require("ndarray-ops");
var ndops   = require("./ndarray-ops-typed");

var a = ndarray(new Int32Array(2048*2048), [2048, 2048]);
var b = ndarray(new Int32Array(2048*2048), [2048, 2048]);
var c = ndarray(new Int32Array(2048*2048), [2048, 2048]);
var d = ndarray(new Float32Array(2048*2048), [2048, 2048]);


for ( var i = 0; i < 1000; i++ ) {
    ndops.cos(a, b, c);
    ndops.add(a, b, d);
}

