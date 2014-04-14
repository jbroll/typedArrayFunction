
**N Dimensional Array Function Generator**
 
The typed-array-function module allows the simple creation of element wise function
operators for javascript TypedArray data.  It uses the
[ndarray](https://github.com/mikolalysenko/ndarray "") data representaion and
performs a role similar to the [cwise](https://github.com/mikolalysenko/cwise "")
function generator.  It has a less complex "mini langauge" notation
than cwise and allows direct interoperatibility with the array of array data
type of numeric.

Typed-array was written to allow computation on scientific image data to be
done in javascript.  It is written to work with ndarray and array of array data
objects.


install using npm

```bash
npm install typed-array-function
```

Create an operator:

```javascript
var typed = require("typed-array-function");

var addeq = typed("function (a, b) { a += b; }");

var X = typed.ndarray(new Float32Array(128*128), [128,128])
var Y = typed.ndarray(new Float32Array(128*128), [128,128])

//Add them together
addeq(X, Y)
```

**Typed-array Function Notation**

  * Pass a string or a function.  If a function is passed it is immedietly converted ot a string, but this allows source code to be correctly check by a jslint like precessor.
  * The text is split in to 3 sections on the "// ----" separator.  If only a single "section" is supplied it is used as the loop body. 
  * The first section is the preparatory code.
  * The second section is enclosed in the element wise loops.
  * The third section is the post code.  If no third section is supplied the function's first argument is returned.

  * The indicies of the element wise loop are accessed via dedicated variables.
    * iX - innermost loop.
    * iY - 2nd dimension loop.
    * iZ - 3rd dimension loop.
    * iU - 4th dimension loop.
    * iV - 5th dimension loop.
    * iW - 6th dimension loop.

  * Or via an array named "index".

**More Examples**

Multiply an array by a value (could be a scaler or another array).

```javascript
var mul = typed("function(a, x) { a *= x; });
```

Initialize an array with with the last index, this is an inconpatible difference with cwise.

```javascript
var mgrid = typed("function(a) { a = iX; }");
```


Check if any element is set.

```javascript
var any = typed(function (a) { if(a) { return true; });
```

Compute the sum of all the elements in an array.

```javascript
var sum  = typed(function (a) {
    var sum = 0;
    // ----
	sum += a;
    // ----
    return sum;
});
```
  

Create a function to fill each element of the array with the return value of a function.  The current indicies are passed as arguments.

```javascript
var fill = typed(function (a, func) { a = func.apply(undefined, index); });
```


Compute the RMS of the values in an array.

```javascript
var rms = typed(function (a) {
    var sum = 0;
    var squ = 0;
    // ----
	    sum +=   a;
	    squ += a*a;
    // ----

    var mean = sum/a.size;

    return Math.sqrt((squ - 2*mean*sum + a.size*mean*mean)/(a.size-1));
});
```


Compute the index of the maximum element of an array:

```javascript
var argmin = typed(function (a) {
	var min_value = Number.POSITIVE_INFINITY;
	var min_index = index.slice(0);

	// ----
	    if ( a < min_value ) {
		min_value = a;

		for(var i=0; i<index.length; ++i) {
		    min_index[i] = index[i];
		}
	    }
	// ----

	return min_index;
});

//Usage:
argmin(X)
```


**Baking Functions**

A significant portion of the execution time of a typed-array function can be
consumed looking up the funcitons type signature in the function cache to see
if it has been generated before.  If the data types of the arguments of a
function that will be called multple time from a particular context are fixed,
the function can be pre generated and saved in a local variable.  I've called this
process "baking".


**Numeric Javascript Support Functions**

Numeric Javascript comes with a bunch of utility funcitons that are nice to have handy.  These functions work on both TypedArray data and Array of Array data.

 * clone(x)	- Make a copy of an n dimensionsal array.
 * iota(x)	- Fill an n element 1d array with the values from 0 to n-1.
 * dim(x)	- Return the shape of an n dimensional array.
 * rep(s, v)	- Return an Array of Arrays n dimensional array of shape s initialised to v.
 * array(s, t, v)	- Return an n dimensional array of shape s, data type t initialised to value v.  Type t maybe an existing ndarray, one of the javascript TypeArray data types or undefined.  The default type is the Array of Array type.

 These functions are added as menbers of the main typed function.  For example:

```javascript
var copy = typed.clone(x);
```


**Is it fast?**

Yes, It is the same as cwise for TypeArray data and slower than numeric for
Array object data.  Baking functions helps.  Porting Numeric Javascript based code to utilize non-allocating functions helps.

**How does it work?**

You can think of typed-array as a macro language on top of JavaScript.
Internally, typed-array uses a simple lexical scanner to parse the functions
you give it. At run time, code for each array operation is generated lazily and
cached.  Typed-array does not make any cache performance optimization claimes
that cwise attempts.  These compiled functions are then memoized for future
calls to the same function.


**Credits**

(c) (2014) John B. Roll

Inspired by the ndarray cwise compiler by Mikola Lysenko.  This README is cribbed directly from cwise.

MIT License
