

var typed   = require("./typed-array");
var numeric = typed;


typed.dot = function dot(x,y) {
    var d = numeric.dim;

    var dimx = d(x);
    var dimy = d(y);

    switch(d(x).length*1000+d(y).length) {
	case 2002: return numeric.dotMM(numeric.array([dimx[0], dimy[1]], x.dtype), x,y);
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

    for(i=n-2;i>=1;i-=2) {
	i1 = i-1;
	ret += x[i]*y[i] + x[i1]*y[i1];
    }
    if(i===0) { ret += x[0]*y[0]; }

    return ret;
}

numeric.dotMV = function dotMV(x,y) {
    var p = x.length, q = y.length,i;
    var ret = this.array([p], x.dtype), dotVV = this.dotVV;
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

numeric.dotMM = function dotMM(reply,x,y) {
    var i,j,k,p,q,r=reply.shape[1],foo,bar,woo,i0,k0,p0,r0;

    p = x.length; q = y.length
    for(i=p-1;i>=0;i--) {
	foo = reply[i];
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
}

numeric.diag = function diag(d) {
    var i,i1,j,n = d.length, A = this.array([n, n], d.dtype), Ai;
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
numeric.identity = function identity(n, type) { return this.diag(this.array([n],type,1)); }

numeric.tensorXX = function tensor(A,x,y) {
    var m = x.length, n = y.length, Ai, i,j,xi;


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
    }

    //console.log(x, y, A[0], A[1]);
}
numeric.tensorXX = typed({ loops: false }, numeric.tensorXX);
numeric.tensor   = function tensor(x,y) {
    var s1, s2;

    if(typeof x === "number" || typeof y === "number") return numeric.mul(x,y);
    var s1 = numeric.dim(x), s2 = numeric.dim(y);
    if(s1.length !== 1 || s2.length !== 1) {
	throw new Error('numeric: tensor product is only defined for vectors');
    }
    
    return numeric.tensorXX(numeric.array([s1[0], s2[0]], x.dtype), x, y)
};


numeric.dotVV = typed({ loops: false }, numeric.dotVV);
numeric.dotVM = typed({ loops: false }, numeric.dotVM);
numeric.dotMV = typed({ loops: false }, numeric.dotMV);
numeric.dotMM = typed({ loops: false }, numeric.dotMM);
numeric.diag  = typed({ loops: false }, numeric.diag);

