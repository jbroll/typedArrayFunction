
**N Dimensional Array Function Generator**
 
The typed-array module allows the simple creation of element wise function
operators for javascript TypedArray data.  It used the
[ndarray](https://github.com/mikolalysenko/ndarray "") data representaion and
performs a role similar to the [cwise](https://github.com/mikolalysenko/cwise "")
function generator.  It has a less complex "mini langauge" notation
than cwise and allows direct interoperatibility with the array of array data
type of numeric.

Typed-array was written to allow computation on scientific image data to be
done in javascript.  The typed-array module is written to work with ndarray
objects.


install using npm

```bash
npm install typed-array-function
```

Create an operator:

```javascript
var typed = require("typed-array");

var addeq = typed("function (a, b) { a += b; }");

var X = typed.ndarray(new Float32Array(128*128), [128,128])
var Y = typed.ndarray(new Float32Array(128*128), [128,128])

//Add them together
addeq(X, Y)
```

**Typed-array Function Notation**

  * Pass a string or a function.
  * The text is split in to 3 sections on the "// ----" separator.
  * The first section is the preparatory code.
  * The second section is enclosed in the element wise loops.
  * The third section is the post code.

  * The indicies of the element wise loop are hard coded.
    * iX - innermost loop.
    * iY - 2nd dimension loop.
    * iZ - 3rd dimension loop.
    * iU - 4th dimension loop.
    * iV - 5th dimension loop.
    * iW - 6th dimension loop.


**Baking Functions**

A significant portion of the execution time of a typed-array function can be
consumed looking up the funcitons type signature in the function cache to see
if it has been generated before.  If the data types of the arguments of a
function that will be called multple time from a particular context are fixed,
the function can be pre generated and saved in a local variable.  I've called this
process "baking" a function.


**Is it fast?**

Yes, It is the same as cwise for TypeArray data and slower than numeric for
Array object data.  Baking functions helps.

**How does it work?**

You can think of typed-array as a macro language on top of JavaScript.
Internally, typed-array uses a simple lexical scanner to parse the functions
you give it. At run time, code for each array operation is generated lazily and
cached.  Typed-array does not make any cache performance optimization claimes
that cwise attempts.  These compiled functions are then memoized for future
calls to the same function.


**Credits**

(c) (2014) John B. Roll

Inspired by the ndarray cwise compiler by Mikola Lysenko.

MIT License
