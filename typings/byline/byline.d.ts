/// <reference path="../node/node.d.ts" />

declare function byline(s: NodeJS.ReadableStream): NodeJS.ReadableStream;

declare module "byline" {
	export = byline;
}