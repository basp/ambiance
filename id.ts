class Generator {
	private last: number;
	
	constructor(seed = 0) {
		this.last = seed;
	}
	
	next() {
		this.last += 1;
		return this.last;
	}
}

export { Generator }