/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*jshint node: true, -W099: true, laxbreak:true, laxcomma:true, multistr:true, smarttabs:true */
/*globals Float32Array, Int32Array */ 

"use strict";

var assert = require('nodeunit').assert;

    assert.ae = function (a, b, message) { assert.deepEqual(a.data, b.data, message); }
    assert.equal      = assert.deepEqual;

var ndarray = require("ndarray");
var ndops   = require("ndarray-ops");
var numeric = require("numeric");

var typed =                     require("typed-array-function");
var typed = typed.extend(typed, require("typed-array-ops"));
var typed = typed.extend(typed, require("typed-matrix-ops"));


exports.sanity = function(unit) {
    var iota = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var ndar = ndarray(new Int32Array(iota), [3, 3]);

    var data = typed.array([3, 3], "int32");
    typed.assign(data, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);


    unit.equal(data.size, 9, "Size");
    unit.equal([data.shape[0], data.shape[1]], [3, 3], "Shape");
    unit.ae(data, ndar, "Arrays equal");

    unit.equal(typed.sum(data), 45, "Sum");

    var sect = typed.array([2, 2], "int32");
    typed.assign(sect, [[1, 2], [4, 5]]);

    unit.ok(ndops.equals(data, ndar), "ndarray equal");
    unit.ok(typed.equals(data, ndar), "typed equal");

    unit.ok(ndops.equals(sect, typed.section(data, [[0, 2], [0, 2]])), "Section offset == 0");
    unit.ok(typed.equals(sect, typed.section(data, [[0, 2], [0, 2]])), "Section offset == 0");
    unit.equal(typed.sum(sect), 12, "Sum lower section");


    var sect = typed.array([2, 2], "int32");
    typed.assign(sect, [[5, 6], [8, 9]]);

    unit.ok(ndops.equals(sect, typed.section(data, [[1, 2], [1, 2]])), "Section offset != 0");
    unit.ok(typed.equals(sect, typed.section(data, [[1, 2], [1, 2]])), "Section offset != 0");
    unit.equal(typed.sum(sect), 28, "Sum upper section");

    unit.done();
}

exports.basics = function(unit) {
    var iota = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var ndar = ndarray(new Int32Array(iota), [3, 3]);
    var here = ndarray(new Int32Array(iota), [3, 3]);

    var data = typed.array([3, 3], "int32");
    var ther = typed.array([3, 3], "int32");
    typed.assign(data, [[1, 2, 3], [4, 5, 6], [7, 8, 9]]);


    ndops.add(here, ndar, ndar); 	unit.ae(typed.add(data, data), here, "Two address add");
    ndops.sub(here, ndar, ndar); 	unit.ae(typed.sub(data, data), here, "Two address sub");
    ndops.mul(here, ndar, ndar); 	unit.ae(typed.mul(data, data), here, "Two address mul");
    ndops.div(here, ndar, ndar); 	unit.ae(typed.div(data, data), here, "Two address div");

    ndops.add(here, ndar, ndar); 	unit.ae(typed.add(ther, data, data), here, "Three address add");
    ndops.sub(here, ndar, ndar); 	unit.ae(typed.sub(ther, data, data), here, "Three address sub");
    ndops.mul(here, ndar, ndar); 	unit.ae(typed.mul(ther, data, data), here, "Three address mul");
    ndops.div(here, ndar, ndar); 	unit.ae(typed.div(ther, data, data), here, "Three address div");

    unit.done();
}

