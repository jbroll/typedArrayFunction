

var size = 3;
var n = 100000


var ndarray = require("ndarray");
var ndops   = require("ndarray-ops");
var cwise   = require("cwise");

var numeric = require("./numeric-1.2.6");

var typed =                     require("./typed-array-function");
var typed = typed.extend(typed, require("./typed-array-ops"));
var typed = typed.extend(typed, require("./typed-matrix-ops"));

//typed.debug = 1;


var a = ndarray(new Int32Array(size*size),   [size, size]);
var b = ndarray(new Int32Array(size*size),   [size, size]);
var c = ndarray(new Int32Array(size*size),   [size, size]);
var d = ndarray(new Float32Array(size*size), [size, size]);

add = typed({ consider: { a : false }}, 
	function (a, b)    {

	    a.data[index[0]] += b;
	});


if ( 0 ) {
    x = cwise({
	args: [ "array", "array", "scalar", "index" ],
	body: function(a, b, c, j) { a = b + c[j] },
	printCode: true
	});

    //console.log(x.toString())

    x(a, b, c);



    process.exit(0);
}


if ( 0 ) {
    typed.addeq(b, 1);

    typed.print(typed.array([3], "int32", 0));

    a = add(typed.array([3], "int32", 0), b);

    typed.print(b);
    typed.print(a);


    process.exit(0);
}



//x(a, b)
//x = typed({ consider: { a: false }}, "function (a, b ) { a[index[1]] += b }");



var E = typed.array([3], Int32Array, 2);
var F = typed.array([3], Int32Array, 5);

//console.log(E.shape);
//console.log(E.shape.length);

function now() { var now = process.hrtime(); return now[0] + now[1]/1e9; }

var e = numeric.rep([size,size], 0)
var f = numeric.rep([size,size], 0)
var g = numeric.rep([size,size], 0)

//typed.addseq(e, 1);
//var g = typed.add(f, 1);

//console.log(e);
//console.log(ndops.equals(a, b));

//typed.assign(E, [1, 2, 3])
//typed.assign(F, [4, 5, 6])


//var t = numeric.tensor(e, f);
//typed.tensor(e, f)
//console.log(t);

//console.log(numeric.mul(t, [1, 3, 9]));
//console.log(numeric.mul([1, 2, 3], t));


function timeit(n, func) {
    var start = now()
    for ( var i = 0; i < n; i++ ) { func(); }
    return now() - start;
}

function addYYY(a,b,c) {
    'use strict';


    var iXstar = 0;
    var iXdims = 0;
    iXdims = Math.max(a.length, iXdims);
    iXdims = Math.max(b.length, iXdims);
    iXdims = Math.max(c.length, iXdims);

    var iYstar = 0;
    var iYdims = 0;
    iYdims = Math.max(a[0].length, iYdims);
    iYdims = Math.max(b[0].length, iYdims);
    iYdims = Math.max(c[0].length, iYdims);

    for ( var iY = iYstar; iY < iYdims; iY++ ) {
	for ( var iX = iXstar; iX < iXdims; iX++ ) {
	    a[iY][iX] = b[iY][iX] + c[iY][iX] ; 
	}
    }
    return a;
}

function addXXX(a,b,c) {
    'use strict';


    var iXstar = 0;
    var iXdims = 0;
    iXdims = Math.max(a.length, iXdims);
    iXdims = Math.max(b.length, iXdims);
    iXdims = Math.max(c.length, iXdims);

    var iYstar = 0;
    var iYdims = 0;
    iYdims = Math.max(a[0].length, iYdims);
    iYdims = Math.max(b[0].length, iYdims);
    iYdims = Math.max(c[0].length, iYdims);


    for ( var iY = iYstar; iY < iYdims; iY++ ) {
	var iYa = a[iY];
	var iYb = b[iY];
	var iYc = c[iY];

	for ( var iX = iXstar; iX < iXdims; iX++ ) {
	    iYa[iX] = iYb[iX] + iYc[iX] ; 
	}
    }
    return a;
}

function addZZZ(a,b,c) {
    'use strict';


    var iXstar = 0;
    var iXdims = 0;
    iXdims = Math.max(a.shape[0], iXdims);
    iXdims = Math.max(b.shape[0], iXdims);
    iXdims = Math.max(c.shape[0], iXdims);

    var iYstar = 0;
    var iYdims = 0;
    iYdims = Math.max(a.shape[1], iYdims);
    iYdims = Math.max(b.shape[1], iYdims);
    iYdims = Math.max(c.shape[1], iYdims);



    for ( var iY = iYstar; iY < iYdims; iY++ ) {
	for ( var iX = iXstar; iX < iXdims; iX++ ) {
	    a.data[(iY)*3 + iX] = b.data[(iY)*3 + iX] + c.data[(iY)*3 + iX] ; 
	}
    }
    return a;
}


typed.add(a, b, 3)

     
typed.addeq(a, b);
typed.addeq(e, f);

numeric.addeq(e, 1)
numeric.addeq(f, 2)
numeric.addeq(g, 3)

var bakedAdd = typed.add.baked(e, f, g);
var bakedAxx = typed.add.baked(a, b, c);

//console.log(e);
//console.log(f);
//console.log(g);



console.log("typed o: ", timeit(n, function (){ typed.add(e, f, g); }));
console.log("typed i: ", timeit(n, function (){ typed.add(a, b, c); }));
console.log("ndops i: ", timeit(n, function (){ ndops.add(a, b, c); }));
console.log("baked x: ", timeit(n, function (){ bakedAxx(a, b, c); }));
console.log("inline0: ", timeit(n, function (){ addZZZ(a, b, c); }));
console.log("inlineY: ", timeit(n, function (){ addYYY(typed.array(typed.dim(e)), e, f); }));
console.log("inlineX: ", timeit(n, function (){ addXXX(typed.array(typed.dim(e)), e, f); }));
console.log("baked 0: ", timeit(n, function (){ bakedAdd(e, f, g); }));
console.log("numeric: ", timeit(n, function (){ numeric.add(e, f); }));

//console.log(bakedAxx.toString());

//console.log(e);

process.exit(0);

console.log(typed.tensor(E, F));


console.log(numeric.dot(e, f));
console.log(typed.dot(e, f));
console.log(typed.dot(E, f));



//typed(function (a) { a[1][2]; })(a);



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


process.exit(0);


for ( var i = 0; i < 1000; i++ ) {
    typed.cos(a, b, c);
    typed.add(a, b, d);
}

