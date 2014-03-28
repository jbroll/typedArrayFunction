/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true, evil: true, regexp: true */
/*jshint node: true, -W099: true, laxbreak:true, laxcomma:true, multistr:true, smarttabs:true */

"use strict";

function replaceIdRefs(str, func) {
    var reply = "";

    var state = -1, match, index, first, i = 0;

console.log(str, str.length)
    while ( i < str.length ) {
	match = str.match(/[a-zA-Z_][a-zA-Z0-9_]*/);		// Find an identifier in the string.

	if ( !match ) { break; }

	index = [];
	i     = match.index + match[0].length;

	state = 0;

	while ( i < str.length ) {
	    if ( str[i] === ']' ) {
		state--;

		if ( state === 0 ) {
		    index.push(str.substring(first, i)); 
		}
	    } else {
		if ( state === 0 ) {
		    if ( str[i] === '[' ) {
			first = i+1;
			state++;
		    }
		    if ( str[i] !== ' ' && str[i] !== '[' ) {
			break;
		    }
		} else {
		    if ( str[i] === '[' ) { state++; }
		}
	    }
	    i++
	}

	reply += str.substr(0, match.index) + func(match[0], index);
	str    = str.substr(i);
	i = 0;
    }

    return reply + str.substr(i);
}

console.log(replaceIdRefs("{ hhh + www[1  ][2][3]", function (x, y) { return ":" + x + y + ":"; }));
console.log(replaceIdRefs("www[1 + T[1]]  [1234] }", function (x, y) { return ":" + x + y + ":"; }));

