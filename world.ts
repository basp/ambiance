class IdGen {
	private last: number;
	
	constructor(seed = 0) {
		this.last = seed;
	}
	
	next() {
		this.last += 1;
		return this.last;
	}
}

var ids = new IdGen();

/*
interface Object {
	id(): number;
	parent(): Object;
	location(): Object;
	contents(): Object[];
	add(obj: Object): void;
	remove(obj: Object): void;
}

const Nothing = { 
	id: () => -1,
	parent: () => Nothing,
	location: () => Nothing,
	contents: () => [],
	add: obj => {},
	remove: obj => {}
};
*/

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