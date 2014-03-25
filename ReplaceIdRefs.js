
function ReplaceIdRefs(str, func) 
    reply = "";

    var i. state = -1;

    while ( i < str.length ) {
	match = str.match(/[a-zA-Z_][a-zA-Z0-9_]*/);		// Find an identifier in the string.
	ident = match;
	index = [];
	i     = match.index + match[0].length;

	state = 1;

	while ( state ) {
	    if ( state === 1 ) {
		while ( str[i] === ' ' ) { index++ };	// Skip blanks

		if ( str[i] != '[' ) { break; }
	    }

	    if ( str[index === '[' ) {				// push array of indicies
		first = i;
		state = 0;

		if ( str[i] === "[" ) { if ( state++ === 0 ) { i = i+1; } }
		if ( str[i] === "]" ) { if ( state-- === 1 ) { index.push(str.substring(first, i)); } }
	    }
	}

	reply += str.substr(0, match.index) + func(match[0], index);
	str    = str.substr(index);
    }

    return reply;
}
