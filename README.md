# Ambiance
Modern LambdaMOO clone.

### Tokenizing
The command `tokenizer` function is useful on it's own and should probably be
extracted to a separate package. It operates on a `Buffer` and is easy to 
use. 

	var tokenizer = require('./tokenizer');
	var buf = new Buffer('foo "bar frotz" quux zoz" lulz"');
	console.log(tokenizer.tokenize(buf));
	// ['foo', 'bar frotz', 'quux', 'zoz lulz']
	
It's *forgiving* with double quotes. A double qoute starts a literal and every
character following it will be copied as is until it finds another double quote
or the end of the buffer.

The `tokenize` function should be pretty memory efficient as it only operates
on the buffer that it is given. Nothing should be copied except for actually 
materializing the `String` tokens.

The `tokenize` module works best in conjunction with a line splitter 
`Transform` like `byline`:  

	> npm install byline --save

And then just create a line seperated command stream to feed into the
tokenizer:

	var byline = require('byline');
	var tokenizer = require('./tokenizer');
	var s = byline(process.stdin);
	s.on('data', data => {
		var tokens = tokenizer.tokenize(data);
		console.log(tokens);
	});
	
The code is setup to convert to a streaming parser as well if you want to use 
it in a `Transform` stream. In that case it's useful to emit an explicit *end*
token. Take a look at the `tokenize` function in the module, it's easy to
convert that to a `_transform` implemenation. You can basically take the whole
implementation and plop it into the `_transform` getting rid of `tokens` and 
instead pushing to `this` instead of `tokens` (this assumes something like 
`byline` to sanitize the input though, it also assumes `objectMode`):

	var tokenizer = require('./tokenizer');

	_transform(chunk, encoding, done) {
		var buf = chunk, tok;
		while (buf.length > 0) {
			buf = tokenizer.skipWhitespace(buf);
			[tok, buf] = tokenizer.token(buf);
			if (tok.length > 0) {
				this.push({ type: 'string', tok: tok.toString('ascii') });
			}
		}
		this.push({ type: 'end' });
		done();
	}

There's now a basic `Transform` implementation included:

	var tokenizer = require('./tokenizer');
	var byline = require('byline');
	var ts = new tokenizer.Stream();
	
	var s = byline(process.stdin);
	s.pipe(ts).
	on('data', data => {
		// `data` will be of type 'String` and you should aggregate
		// once you reach the *end* token.
	});

### Notes
player, verb, args, argstr, dobj, iobj, prep