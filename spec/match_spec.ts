/// <reference path="../typings/tsd.d.ts" />

import match = require('../match'); 

describe('verb name matching', () => {
	it('supports wildcards', () => {
		var cases: [string, string, boolean][] = [
			['foo'  , 'foo'    , true ],
			['foo'  , 'foo*'   , true ],
			['fooq' , 'foo*'   , true ],
			['foo'  , 'foo*bar', true ],
			['quux' , 'foo*bar', false],
			['fooq' , 'foo*bar', false],
			['fooba', 'foo*bar', true ]	
		];
		
		for(var c of cases) {
			var [s, v, expected] = c;
			expect(match.verbName(s, v)).toBe(expected);
		}		
	});
});

describe('object argument matching', () => {
	it('matches none when obj and objstr are empty', () => {
		expect(match.objArg({}, {}, '', 'none')).toBeFalsy();
		expect(match.objArg({}, undefined, '', 'none')).toBeTruthy();		
	});
	
	it('matches this when obj and this are the same', () => {
		var self = {};
		expect(match.objArg({}, {}, '', 'this')).toBeFalsy();
		expect(match.objArg(self, self, '', 'this')).toBeTruthy();
	});
});