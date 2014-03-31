

var typed   = require("./typed-array");
var numeric = typed;


typed.dot = function dot(x,y) {
    var d = numeric.dim;

    switch(d(x).length*1000+d(y).length) {
	case 2002: return numeric.dotMMsmall(x,y);
	case 2001: return numeric.dotMV(x,y);
	case 1002: return numeric.dotVM(x,y);
	case 1001: return numeric.dotVV(x,y);
	case 1000: return numeric.mulVS(x,y);
	case 1: return numeric.mulSV(x,y);
	case 0: return x*y;
	default: throw new Error('numeric.dot only works on vectors and matrices');
    }
}

numeric.dotVV = function dotVV(x,y) {
    var i,n=x.length,i1,ret = x[n-1]*y[n-1];

    console.log(n, x[n-1], ret);

    for(i=n-2;i>=1;i-=2) {
	i1 = i-1;
	ret += x[i]*y[i] + x[i1]*y[i1];

    console.log(ret);

    }
    if(i===0) { ret += x[0]*y[0]; }

    console.log(ret);

    return ret;
}

numeric.dotMV = function dotMV(x,y) {
    var p = x.length, q = y.length,i;
    var ret = numeric.array([p], x.dtype), dotVV = numeric.dotVV;
    for(i=p-1;i>=0;i--) { ret[i] = dotVV(x[i],y); }
    return ret;
}

numeric.dotVM = function dotVM(x,y) {
    var i,j,k,p,q,r,ret,foo,bar,woo,i0,k0,p0,r0,s1,s2,s3,baz,accum;
    p = x.length; q = y[0].length;
    ret = numeric.array([q], x.dtype);
    for(k=q-1;k>=0;k--) {
	woo = x[p-1]*y[p-1][k];
	for(j=p-2;j>=1;j-=2) {
	    i0 = j-1;
	    woo += x[j]*y[j][k] + x[i0]*y[i0][k];
	}
	if(j===0) { woo += x[0]*y[0][k]; }
	ret[k] = woo;
    }
    return ret;
}

numeric.dotMMsmall = function dotMMsmall(x,y) {
    var i,j,k,p,q,r,ret,foo,bar,woo,i0,k0,p0,r0;
    p = x.length; q = y.length; r = y[0].length;
    ret = numeric.array([p, r], x.dtype);
    for(i=p-1;i>=0;i--) {
	foo = ret[i];

	bar = x[i];
	for(k=r-1;k>=0;k--) {
	    woo = bar[q-1]*y[q-1][k];
	    for(j=q-2;j>=1;j-=2) {
		i0 = j-1;
		woo += bar[j]*y[j][k] + bar[i0]*y[i0][k];
	    }
	    if(j===0) { woo += bar[0]*y[0][k]; }
	    foo[k] = woo;
	}
	//ret[i] = foo;
    }
    return ret;
}

numeric.diag = function diag(d) {
    var i,i1,j,n = d.length, A = numeric.array([n, n], d.dtype), Ai;
    for(i=n-1;i>=0;i--) {
	Ai = A[i];
	i1 = i+2;
	for(j=n-1;j>=i1;j-=2) {
	    Ai[j] = 0;
	    Ai[j-1] = 0;
	}
	if(j>i) { Ai[j] = 0; }
	Ai[i] = d[i];
	for(j=i-1;j>=1;j-=2) {
	    Ai[j] = 0;
	    Ai[j-1] = 0;
	}
	if(j===0) { Ai[0] = 0; }
	//A[i] = Ai;
    }
    return A;
}
numeric.identity = function identity(n, type) { return numeric.diag(numeric.array([n],type,1)); }

numeric.tensor = function tensor(x,y) {
    if(typeof x === "number" || typeof y === "number") return numeric.mul(x,y);
    var s1 = numeric.dim(x), s2 = numeric.dim(y);
    if(s1.length !== 1 || s2.length !== 1) {
	throw new Error('numeric: tensor product is only defined for vectors');
    }
    var m = s1[0], n = s2[0], A = numeric.array([m, n], x.dtype), Ai, i,j,xi;
    for(i=m-1;i>=0;i--) {
	Ai = A[i];
	xi = x[i];
	for(j=n-1;j>=3;--j) {
	    Ai[j] = xi * y[j];
	    --j;
	    Ai[j] = xi * y[j];
	    --j;
	    Ai[j] = xi * y[j];
	    --j;
	    Ai[j] = xi * y[j];
	}
	while(j>=0) { Ai[j] = xi * y[j]; --j; }
	//A[i] = Ai;
    }
    return A;
}


numeric.dotVV 	   = typed({ loops: false }, numeric.dotVV);
numeric.dotVM 	   = typed({ loops: false }, numeric.dotVM);
numeric.dotMV 	   = typed({ loops: false }, numeric.dotMV);
numeric.dotMMsmall = typed({ loops: false }, numeric.dotMMsmall);
numeric.diag       = typed({ loops: false }, numeric.diag);
numeric.tensor     = typed({ loops: false }, numeric.tensor);

