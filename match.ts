/// <reference path="typings/tsd.d.ts" />

import S = require('string');

function verbName(s: string, v: string): boolean {
	var chunks = v.split('*').filter(x => !S(x).isEmpty());
	if (chunks.length == 2) {
		return S(chunks.join('')).startsWith(s);
	}
	else if (S(v).endsWith('*')) {
		return S(s).startsWith(chunks[0]);
	}
	else {
		return s === v;
	}
}

function objArg(self, obj, objstr: string, arg: string): boolean {
	if (arg === 'none') {
		return !obj && S(objstr).isEmpty();
	}
	else if (arg === 'this') {
		return obj === self;
	}
	else if (arg === 'any') {
		return true;
	}
	return false;
}

export = { verbName, objArg };