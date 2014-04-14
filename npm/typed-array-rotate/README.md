
**Typed Array Rotate**

This is image-rotate ported to typed-array-function


**Install*

```bash
npm install typed-array-rotate
```

**Example**

```javascript
//Allocate storage for result
var source = require("zeros")([512, 512])
var result = require("zeros")([512, 512])

//Rotate the image
require("typed-array-rotate")(result, source, Math.PI / 6.0)
```

**API**

require("image-rotate")(output,input,theta[,iX,iY,oX,oY])

Rotates an image by theta radians about the point iX,iY in the source image and translated to the point oX,oY in the output image.

 * output is an array that gets the output of rotating the image
 * input is the image which is rotated
 * theta is the amount to rotate by in radians
 * iX,iY is the point to rotate about (default center of input)
 * oX,oY is the image of the point to rotate about in output image (default center of output)

Returns output

**Credits**

(c) John B Roll

This READMEmd is cribbed directly from image-rotate.

