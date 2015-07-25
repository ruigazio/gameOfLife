	var Display = function(neighbours, alive, style){
		this.neighbours = neighbours;
		this.alive = alive;
		this.style = style;
	};

	Display.prototype.clone = function(){
		return new Display( this.neighbours, this.alive, this.style);
	};

	var Cell = function(x, y, alive) {
		this.display = new Display(0, alive, "none");
		this.x = x;
		this.y = y;
		this.alive = alive;
		this.neighbours = 0;
		this.previous = [];
		this.following = [];
	};

	Cell.prototype.historyLimit = 50;

	Cell.prototype.reset = function(alive) {
		this.alive = !!alive;
		this.previous = [];
		this.following = [];
		this.neighbours = 0;
		this.display.alive = !!alive;
		this.display.neighbours = 0;
		this.display.style = "none";
	};

	Cell.prototype.stepBack = function() {
		this.following.push( this.display );
		this.display = this.previous.pop();
	};

	Cell.prototype.stepForward = function() {
		this.previous.push( this.display );
		this.display = this.following.pop();
	};

	Cell.prototype.invertState = function() {
		this.display.alive = !this.display.alive;
	};

	Cell.prototype.getNextState = function() {
		var nextState = this.alive && (this.neighbours > 1 && this.neighbours < 4) 
			|| ( !this.alive && this.neighbours === 3);

		if( this.alive !== nextState )
			this.display.style = nextState ? "overline" : "line-through";
		else 
			this.display.style = "none";

		this.display.neighbours = this.neighbours;
		this.display.alive = this.alive;
		this.alive = nextState;
		this.neighbours = 0;
	}

	Cell.prototype.liveOrDie = function() {
		var display = this.display.clone();

		if( this.previous.length > this.historyLimit){
			this.previous.shift();
		}
		this.previous.push( display );

		this.getNextState();
	};

	var Grid = function(x,y, sparse){

		this.x = x;
		this.y = y;
		this.cells = new Array(x); 
		this.cellSize = 15;
		this.sparseFactor = sparse;

		for( var i=0; i < x; i++){
			this.cells[i] = new Array(y);
			for (var j = 0; j < y; j++) {
				this.cells[i][j] = new Cell(i,j,false);
			}
		}
	};
	

	Grid.prototype.getCell = function(x, y) {
		return this.cells[x][y];
	};

	Grid.prototype.setCell = function(x, y, alive) {
		(this.cells[x][y]).alive = alive;
	};

  Grid.prototype.map = function(f,args){
		args = args || [];
		this.cells.map( function(row){
				row.map(function(cell){ f.apply(cell,args) }) 
		});
	}

  Grid.prototype.setBlankState = function(){
		this.map( Cell.prototype.reset,[false] );
	};

  Grid.prototype.setRandomState = function(){
		var initialState = new Uint8Array( this.x * this.y );
		crypto.getRandomValues(initialState);
		for (var x = 0, i=0; x < this.x; x++) {
			for (var y = 0; y < this.y; y++, i++) {
				(this.cells[x][y]).reset(initialState[i] < this.sparseFactor);
			}
		}
	};

