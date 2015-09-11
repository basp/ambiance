/// <reference path="typings/tsd.d.ts" />

import stream = require('stream');

const TAB = 9;
const LF = 10;
const CR = 13;
const SPACE = 32;
const QUOTE = 34;

function isWhitespace(b: number): boolean {
	switch (b) {
		case TAB: return true;
		case SPACE: return true;
		case LF: return true;
		case CR: return true;
		default: return false;
	}
}

function skipWhitespace(buf: Buffer): Buffer {
	var i = 0;
	while (i < buf.length) {
		if (!isWhitespace(buf[i])) {
			return buf.slice(i);
		}
		i += 1;
	}
	return new Buffer(0);
}

function quotedString(buf: Buffer, prefix: Buffer = new Buffer(0)): [Buffer, Buffer] {
	var tok = prefix, i = 0, rest;
	while (i < buf.length - 1) {
		// Look for double quote followed by space (`" `)
		if (buf[i] === QUOTE && isWhitespace(buf[i + 1])) {
			rest = buf.slice(i + 1);
			return [tok, rest];
		}
		else if (buf[i] !== QUOTE) {
			// Otherwise just append any non-quote characters
			//
			// NOTE: 
			// Isn't there a more efficient way to append  single 
			// bytes to a `Buffer` instance? 
			tok = Buffer.concat([tok, buf.slice(i, i + 1)]);
		}
		i += 1;
	}
	// Ignore any final double quote (`"`)
	if (buf[i] !== QUOTE) {
		tok = Buffer.concat([tok, buf.slice(i)]);		
	}
	rest = new Buffer(0);
	return [tok, rest];
}

function token(buf: Buffer): [Buffer, Buffer] {
	var i = 0, rest, tok;
	while (i < buf.length) {
		if (buf[i] === QUOTE) {
			rest = buf.slice(0, i);
			tok = buf.slice(i + 1);
			return quotedString(tok, rest);
		}		
		if (isWhitespace(buf[i])) {
			tok = buf.slice(0, i);
			rest = buf.slice(i + 1);
			return [tok, rest];
		}
		i += 1;
	}
	tok = buf.slice(0, i);
	rest = new Buffer(0);
	return [tok, rest];
}

function tokenize(buf: Buffer): string[] {
	var tokens = [], tok;
	while (buf.length > 0) {
		buf = skipWhitespace(buf);
		[tok, buf] = token(buf);
		if (tok.length > 0) {
			tokens.push(tok.toString('ascii'));
		}
	}
	return tokens;	
}

class Stream extends stream.Transform {
	constructor() {
		super({ objectMode: true });
	}
	
	_transform(chunk, encoding, done) {
		var buf = chunk, tok;
		while (buf.length > 0) {
			buf = skipWhitespace(buf);
			[tok, buf] = token(buf);
			if (tok.length > 0) {
				this.push({ type: 'string', tok: tok.toString('ascii') });
			}
		}
		this.push({ type: 'end' });
		done();
	}
}

export { 
	Stream, 
	tokenize, 
	token, 
	isWhitespace 
}