/// <reference path="typings/tsd.d.ts" />

import { tokenize } from './tokenizer';

var prepositions = {
    'with': true,
    'using': true,
    'at': true,
    'to': true,
    'in front of': true,
    'in': true,
    'inside': true,
    'into': true,
    'on top of': true,
    'on': true,
    'onto': true,
    'upon': true,
    'out of': true,
    'from inside': true,
    'from': true,
    'over': true,
    'through': true,
    'under': true,
    'underneath': true,
    'beneath': true,
    'behind': true,
    'beside': true,
    'for': true,
    'about': true,
    'is': true,
    'as': true,
    'off of': true,
    'off': true
};

function findPreposition(tokens: string[]): {start: number, length: number} {
	var i, j, maybe, len = tokens.length;
	for (i = 0; i < len; i++) {
		maybe = [tokens[i], undefined, undefined];
		if (i < len - 1) {
			maybe[1] = tokens.slice(i, i + 2).join(' ');
		}
		if (i < len - 2) {
			maybe[2] = tokens.slice(i, i + 3).join(' ');
		}
		for (j = 2; j >= 0; j--) {
			if (prepositions[maybe[j]]) {
				return { start: i, length: j + 1 };
			}
		}
	}	
	return undefined;
}

interface ParseResult {
	verb: string;
	args: string[];
	dobjstr: string;
	prepstr: string;
	iobjstr: string;
}

function parse(buf: Buffer): ParseResult {
	var tokens = tokenize(buf),
		args = tokens.slice(1),
		prepstr = '', iobjstr = '', dobjstr = '',
		prep = findPreposition(args);
		
	if (prep) {
		dobjstr = args.slice(0, prep.start).join(' ');
		prepstr = args.slice(prep.start, prep.start + prep.length).join(' ');
		iobjstr = args.slice(prep.start + prep.length).join(' ');
	}
	else {
		dobjstr = args.join(' ');
	}
	
	return {
		verb: tokens[0],
		args,
		dobjstr,
		prepstr,
		iobjstr
	}
}

export { parse }