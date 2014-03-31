/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*jshint node: true, -W099: true, laxbreak:true, laxcomma:true, multistr:true, smarttabs:true */
/*globals Float32Array, Int32Array */ 

"use strict";

var ndarray = require("ndarray");
var ndops   = require("ndarray-ops");
var numeric = require("./numeric-1.2.6");

var typed =                     require("./typed-array");
var typed = typed.extend(typed, require("./typed-array-ops"));
var typed = typed.extend(typed, require("./typed-matrix-ops"));


var size = 2048;

var a = ndarray(new Int32Array(size*size),   [size, size]);
var b = ndarray(new Int32Array(size*size),   [size, size]);
var c = ndarray(new Int32Array(size*size),   [size, size]);
var d = ndarray(new Float32Array(size*size), [size, size]);

var E = typed.array([3], Int32Array, 2);
var F = typed.array([3], Int32Array, 5);

var e = numeric.rep([3], 2)
var f = numeric.rep([3], 5)

//console.log(numeric.tensor(e, f));
//console.log(typed.tensor(e, f));
//console.log(typed.tensor(E, F));

console.log(typed.dot(e, f));
//console.log(typed.dot(E, f));

process.exit(0);


//typed(function (a) { a[1][2]; })(a);


//ndops.addseq(a, 1);
//typed.addeq(b, 1);

ndops.qcenter = typed(function (a) {
	var max = Number.MIN_VALUE;
	var idx = undefined;

	// ---- // [1:-1][1:-1]
	    var sum = a +
		    + a[iY-1] [iX  ] 
		    + a[iY-1][iX+1] 
		    + a[iY  ][iX-1] 
	    	    + a[iY  ][iX  ]
		    + a[iY  ][iX+1] 
		    + a[iY+1][iX-1] 
		    + a[iY+1][iX  ] 
		    + a[iY+1][iX+1];

	    if ( max < sum ) {
		max = sum;
		idx = index.concat();
	    }
	// ----

	return idx;
})(a);

console.log(ndops.equals(a, b));

process.exit(0);


for ( var i = 0; i < 1000; i++ ) {
    typed.cos(a, b, c);
    typed.add(a, b, d);
}

