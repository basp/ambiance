import { Generator } from './id';

let ids = new Generator();

function create(parent?: Object) {
	let id = ids.next();
	var contents = [], location = undefined;
	return {
		id: () => id,
		parent: () => parent,
		location: () => location,
		contents: () => contents,
		add: obj => { 
			contents.push(obj) 
		},
		remove: obj => {
			var i = contents.indexOf(obj);
			contents.splice(i, 1);
		}
	}	
}

export { 
	create 
}