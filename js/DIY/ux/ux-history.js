define([], function() {
	function History() {
		this.memory = [];
		this.MAXSIZE = 30;
		this.current = 0;

	}

	History.prototype.push = function(content) {
		if (!content) {
			return false;
		}
		if (this.current !== this.memory.length) {
			this.memory.splice(this.current);
		}
		if (this.memory.length === this.MAXSIZE) {
			this.current -= 1;
			this.memory.splice(0, 1);
		}
		this.current += 1;
		this.memory.push(content);
		localStorage.setItem('history', content);
	};

	History.prototype.pop = function(content) {
		if (this.memory.length) {
			this.current -= 1;
			return this.memory.pop();
		}
	};

	History.prototype.prev = function() {
		if (this.current == 1) {
			return false;
		}
		this.current -= 1;
		return this.memory[this.current-1];
	};

	History.prototype.next = function() {
		if (this.current === this.memory.length) {
			return false;
		}
		this.current += 1;
		return this.memory[this.current];
	};


	return new History();

});