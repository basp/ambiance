/// <reference path="../typings/tsd.d.ts" />

import {tokenize} from '../tokenizer';

describe('command tokenizer', () => {
	it('tokenizes on whitespace', () => {
		var buf = new Buffer('foo bar quux');
		var expected = ['foo', 'bar', 'quux'];
		var actual = tokenize(buf);
		expect(actual).toEqual(expected);
	});
	
	it('strips extraneous whitespace', () => {
		var buf = new Buffer('  foo  bar  quux  ');
		var expected = ['foo', 'bar', 'quux'];
		var actual = tokenize(buf);
		expect(actual).toEqual(expected);
	});
	
	it('parses quoted strings', () => {
		var buf = new Buffer('foo "bar frotz" and "quux zoz" lulz');
		var expected = ['foo', 'bar frotz', 'and', 'quux zoz', 'lulz'];
		var actual = tokenize(buf);
		expect(actual).toEqual(expected);
	});
	
	it('ignores misplaced quotes', () => {
		var buf = new Buffer('foo "bar"frotz quux" foz');
		var expected = ['foo', 'barfrotz quux', 'foz'];
		var actual = tokenize(buf);
		expect(actual).toEqual(expected);
	});
	
	it('ignores trailing quotes', () => {
		var buf = new Buffer('foo "bar quux" "frotz lu"lz"');
		var expected = ['foo', 'bar quux', 'frotz lulz'];
		var actual = tokenize(buf);
		expect(actual).toEqual(expected);
	});
});