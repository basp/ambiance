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