interface StringJS {
	between(left: string, right: string): StringJS;
	
	camelize(): StringJS;
	
	capitalize(): StringJS;
	
	chompLeft(prefix: string): StringJS;
	
	chompRight(suffix: string): StringJS;
	
	collapseWhitespace(): StringJS;
	
	contains(ss: string): boolean;
	
	count(substring: string): number;
	
	dasherize(): StringJS;
	
	endsWith(ss: string): boolean;
	
	ensureLeft(prefix: string): StringJS;
	
	ensureRight(suffix: string): StringJS;
	
	humanize(): StringJS;
	
	isAlpha(): boolean;
	
	isAlphaNumeric(): boolean;
	
	isEmpty(): boolean;
	
	isLower(): boolean;
	
	isNumeric(): boolean;
	
	isUpper(): boolean;
	
	latinise(): StringJS;
	
	left(n: number): StringJS;
	
	lines(): string[];
	
	pad(len: number, char?: string): StringJS;
	
	padLeft(len: number, char?: string): StringJS;
	
	padRight(len: number, char?: string): StringJS;
	
	repeat(n: number): StringJS;
	
	replaceAll(ss: string, newstr: string): StringJS;
	
	right(n: number): StringJS;
	
	s: string;	
	
	setValue(v: string): StringJS;
	
	slugify(): StringJS;

	startsWith(ss: string): boolean;

	strip(...args: string[]): StringJS;
	
	stripPunctuation(): StringJS;
	
	template(values: any, open?: string, close?: string): StringJS;
	
	toBool(): boolean;
	
	toFloat(precision?: number): number;
	
	toInt(): number;
	
	trim(): StringJS;
	
	trimLeft(): StringJS;
	
	trimRight(): StringJS;
	
	truncate(length: number, chars?: string): StringJS;
	
	underscore(): StringJS;
}

declare function S(s: string): StringJS;

declare module "string" {
	export = S;
}