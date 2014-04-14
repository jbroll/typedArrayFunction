/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, bitwise: true */

"use strict";

var interp = require("ndarray-linear-interpolate");
var typed = require("typed-array-function");

var do_warp = typed(function (dest, func, interp) {
    var warped = dest.shape.slice(0);

    var iX = 0, iY = 0, iZ = 0;

    // ----
	func(warped, [iX, iY, iZ]);
	dest = interp.apply(undefined, warped);
    // ----
});
        
var do_warp_1 = typed(function (dest, func, interp, src) {
    var warped = [0];
    var SRC = src;

    var iX = 0;

    // ----
	func(warped, [iX]);
	dest = interp(SRC, warped[0]);
    // ----
});

var do_warp_2 = typed(function (dest, func, interp, src) {
    var warped = [0, 0];
    var SRC = src;

    var iX = 0, iY = 0;

    // ----
	func(warped, [iY, iX]);
	dest = interp(SRC, warped[0], warped[1]);
    // ----
});

var do_warp_3 = typed(function (dest, func, interp, src) {
    var warped = [0, 0, 0];
    var SRC = src;

    var iX = 0, iY = 0, iZ = 0;

    // ----
	func(warped, [iZ, iY, iX]);
	dest = interp(SRC, warped[0], warped[1], warped[2]);
    // ----
});

module.exports = function warp(dest, src, func) {
  switch(src.shape.length) {
    case 1:
      do_warp_1(dest, func, interp.d1, src);
      break;
    case 2:
      do_warp_2(dest, func, interp.d2, src);
      break;
    case 3:
      do_warp_3(dest, func, interp.d3, src);
      break;
    default:
      do_warp(dest, func, interp.bind(undefined, src));
      break;
  }
  return dest;
};
