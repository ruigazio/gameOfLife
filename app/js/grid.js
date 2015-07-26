var Display = function(neighbours, alive, nextState, style){
    this.neighbours = neighbours;
    this.alive = alive;
    this.nextState = nextState;
    this.style = style;
};

Display.prototype.clone = function(){
    return new Display( this.neighbours, this.alive, this.nextState, this.style);
};

var Cell = function(x, y, alive) {
    this.display = new Display(0, alive, alive, "none");
    this.x = x;
    this.y = y;
    this.alive = alive;
    this.neighbours = 0;
    this.previous = [];
    this.following = [];
};


Cell.prototype.reset = function(alive) {
    this.alive = !!alive;
    this.previous = [];
    this.following = [];
    this.neighbours = 0;
    this.display.alive = !!alive;
    this.display.nextState = !!alive;
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

    if( this.alive !== nextState ){
        this.display.style = nextState ? "overline" : "line-through";
        Cell.prototype.colonyChanged = true;
    }
    else 
        this.display.style = "none";

    this.display.neighbours = this.neighbours;
    this.display.alive = this.alive;
    this.display.nextState = nextState;
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
    this.sparseFactor = sparse;

    for( var i=0; i < y; i++){
        this.cells[i] = this.createRow(i);
    }
};

Grid.prototype.createRow = function( y ) {
    var row = new Array( this.x );
    for (var j = 0; j < this.x; j++) {
        row[j] = new Cell( j, y, false);
    }
    return row;
}

Grid.prototype.getCell = function(x, y) {
    return this.cells[y][x];
};

Grid.prototype.setCell = function(x, y, alive) {
    (this.cells[y][x]).alive = alive;
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
    for (var y = 0, i=0; y < this.y; y++) {
        for (var x = 0; x < this.x; x++, i++) {
            (this.cells[y][x]).reset(initialState[i] < this.sparseFactor);
        }
    }
};

Grid.prototype.addCol = function() {
    this.x++;
    this.cells.forEach( function(row, y) {
        row.push( new Cell( this.x, y, false) );
    });
}

Grid.prototype.removeCol = function() {
    this.x--;
    this.cells.forEach( function(row) {
        row.pop();
    });
}

Grid.prototype.addRow = function() {
    this.y++;
    this.cells.push( this.createRow( this.y ) );
};

Grid.prototype.removeRow = function() {
    this.y--;
    this.cells.pop();
}

Grid.prototype.fromJson = function(list) {
    list.forEach( function(coor) {
        this.getCell( coor[0], coor[1]).reset( true );
    }, this);
};

Grid.prototype.toJson = function() {
    return this.cells.reduce( function( out, row ){
        return row.reduce( function( out, cell ) {
            if( cell.display.alive )
                out.push(  [cell.x, cell.y] );
            return out;
        }, out)
    }, []);
};

