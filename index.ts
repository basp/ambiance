/// <reference path="typings/tsd.d.ts" />

// Once we have a verb, a preposition and direct and indirect objects we can
// look for a matching verb by searching the following objects in order:
//
// 1. The player who typed the command
// 2. The room the player is in
// 3. The direct object (if any)
// 4. The indirect object (if any)
//
// For each of these verbs in turn it tests if all of the following are true:
// 
// * The verb string in the command matches one of the names for the verb.
// * The direct and indirect object values found by matching are allowed by
//   the corresponding argument specifiers for the verb
// * The preposition string in the command is matched by the proposition
//   specifier for the verb.
//
// Argument specifiers for the direct and indirect object are drawn from the
// set `none`, `any` and `this`. The argument specifier for the preposition is
// either `none`, `any` or one of several sets of prepositional phrases.
// 
// Verb args specifications have the following form: {dobj, prep, iobj}.
//

import byline = require('byline');
import { parse } from './parser';
import { create } from './world';

var obj1 = create(),
	obj2 = create(),
	obj3 = create();
	
obj1.add(obj2);
obj1.add(obj3);

console.log(obj1.contents().map(x => `#${x.id()}`));

obj1.remove(obj3);

console.log(obj1.contents().map(x => `#${x.id()}`));
