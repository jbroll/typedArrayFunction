
**Typed Array Operators**

This package creates a number of usefull operator functions for ndarray data.  Many of the funcitons provided by the [ndarray-ops](npm/typed-array-function/package.json) package and those provided [Numeric Javascript](http://www.numericjs.com/) are available.

```bash
npm install typed-array-function
npm install typed-array-ops
```

**Example Usage**


```javascript
//First, import libraries
var typed =                     require("typed-array-function");
    typed = typed.extend(typed, require("typed-array-ops"));

//Next, create some arrays
var a = ndarray(new Float32Array(128*128))
  , b = ndarray(new Float32Array(128*128))
  , c = ndarray(new Float32Array(128*128))

//Initialize b with some random numbers:
typed.random(b)

//Set c to a constant 1
typed.assign(c, 1.0)

//Add b and c, store result in a:
typed.add(a, b, c)

//Multiply a by 0.5 in place
typed.mulseq(a, 0.5)

//Print some statistics about a:
console.log(
  "inf(a) = ", ops.inf(a),
  "sup(a) = ", ops.sup(a),
  "argmin(a) = ", ops.argmin(a),
  "argmax(a) = ", ops.argmax(a),
  "norm1(a) = ", ops.norm1(a))
```

**Conventions**

This library implements component-wise operations for all of the operators and Math.* functions in JS, along with a few commonly used aggregate operations. Most of the functions in the library work by applying some symmetric binary operator to a pair of arrays. You call them like this:

```javascript
typed.add(dest, arg1, arg2)
```
Which translates into code that works (approximately) like this:

```javascript
for(var i=0; i<dest.shape[0]; ++i) {
  dest[i] = arg1[i] + arg2[i]
}
```

This library will create new arrays for you as is the convention in Numeric Javascript, but you might wish to avoid this expensive allocation for intermediate results by providing destination arrays where apropriate.
You may specify where the result is stored, or the library will allocate a destination array that is of the same type as the first argument.  When supplying a binary operator function with 3 arguments, the first argument is used as the result.  If the call has only 2 arguments then a result array will be allocated.  

Scaler variations of the operators, suffixed with 's', are provided for compatibility with ndarray-ops, but are unnecessary.  These functions are aliases for thier array versions.

**The following operators follow this rule:**

 * add[,s,eq,seq] - Addition, +
 * sub[,s,eq,seq] - Subtraction, -
 * mul[,s,eq,seq] - Multiplication, *
 * div[,s,eq,seq] - Division, /
 * mod[,s,eq,seq] - Modulo, %
 * band[,s,eq,seq] - Bitwise And, &
 * bor[,s,eq,seq] - Bitwise Or, &
 * bxor[,s,eq,seq] - Bitwise Xor, ^
 * lshift[,s,eq,seq] - Left shift, <<
 * rshift[,s,eq,seq] - Signed right shift, >>
 * rrshift[,s,eq,seq] - Unsigned right shift, >>>
 * lt[,s,eq,seq] - Less than, <
 * gt[,s,eq,seq] - Greater than, >
 * leq[,s,eq,seq] - Less than or equal, <=
 * geq[,s,eq,seq] - Greater than or equal >=
 * eq[,s,eq,seq] - Equals, ===
 * neq[,s,eq,seq] - Not equals, !==
 * and[,s,eq,seq] - Boolean And, &&
 * or[,s,eq,seq] - Boolean Or, ||
 * max[,s,eq,seq] - Maximum, Math.max
 * min[,s,eq,seq] - Minimum, Math.min


**Assignment**

The assignment operator:

 * assign(dest, src) copies one array into another.

**Nullary operators**

Nullary operators only take on argument for the array they are assigning to, and don't have any variations. Currently there is only one of these:

 * random - Sets each element of an array to a random scalar between 0 and 1, Math.random()

**Unary operators**

Unary operators have three forms, they can be written as either:

 * op.abs(dest, arg)	- dest = abs(arg)
 * op.abs(arg)	- allocate new array for destination, then call op.args(dest, arg)
 * op.abseq(dest)	- dest = abs(dest)
 
Typed-array-ops exposes the following unary operators:

 * not[,eq] - Boolean not, !
 * bnot[,eq] - Bitwise not, ~
 * neg[,eq] - Negative, -
 * recip[,eq] - Reciprocal, 1.0/
 * abs[,eq] - Absolute value, Math.abs
 * acos[,eq] - Inverse cosine, Math.acos
 * asin[,eq] - Inverse sine, Math.asin
 * atan[,eq] - Inverse tangent, Math.atan
 * ceil[,eq] - Ceiling, Math.ceil
 * cos[,eq] - Cosine, Math.cos
 * exp[,eq] - Exponent, Math.exp
 * floor[,eq] - Floor, Math.floor
 * log[,eq] - Logarithm, Math.log
 * round[,eq] - Round, Math.round
 * sin[,eq] - Sine, Math.sin
 * sqrt[,eq] - Square root, Math.sqrt
 * tan[,eq] - Tangent, Math.tan

**Non-symmetric binary operators**

There are also a few non-symmetric binary operators.  There are only two of these:

 * atan2[,s,eq,seq,op,sop,opeq,sopeq]
 * pow[,s,eq,seq,op,sop,opeq,sopeq]


**Map-reduce (aggregate) operators**

Finally, there are aggregate operators that take an array as input and compute some aggregate result or summary. These functions don't have any special suffixes and all of them take a single array as input.

 * equals - Check if two ndarrays are equal
 * any - Check if any element of the array is truthy
 * all - Checks if any element of the array is falsy
 * sum - Sums all elements of the array
 * prod - Multiplies all elements of the array
 * norm2squared - Computes the squared L2 norm
 * norm2 - Computes the L2 norm
 * sup - Max element in array
 * inf - Min element in array


**Credits**

(c) 2014 John B Roll

Inspired by ndarray-ops by Mikola Lysenko.  This README is cribbed directly from ndarray-ops.

MIT License

