'use strict';
(function(gridClassBuilder){
	window.LifeApp = window.LifeApp || {};
	window.LifeApp.Grid = gridClassBuilder( window.LifeApp );
})
(function( LifeApp ){

var Grid = function(x,y, sparse){

	this.x = x;
	this.y = y;
	this.cells = new Array(x); 
	this.sparseFactor = sparse;

	for( var i=0; i < y; i++){
		this.cells[i] = this.createRow(i);
	}
};

var Cell = LifeApp.Cell;

Grid.prototype = {
createRow: function( y ) {
	var row = new Array( this.x );
	for (var j = 0; j < this.x; j++) {
		row[j] = new Cell( j, y, false);
	}
	return row;
},

getCell: function(x, y) {
	return this.cells[y][x];
},

setCell: function(x, y, alive) {
	(this.cells[y][x]).alive = alive;
},

map: function(f,args){
	args = args || [];
	this.cells.map( function(row){
			row.map(function(cell){ f.apply(cell,args); });
	});
},

setBlankState: function(){
	this.map( Cell.prototype.reset,[false] );
},

setRandomState: function(){
	var initialState = new Uint8Array( this.x * this.y );
	window.crypto.getRandomValues(initialState);
	for (var y = 0, i=0; y < this.y; y++) {
		for (var x = 0; x < this.x; x++, i++) {
			(this.cells[y][x]).reset(initialState[i] < this.sparseFactor);
		}
	}
},

addCol: function() {
	this.x++;
	this.cells.forEach( function(row, y) {
		row.push( new Cell( this.x, y, false) );
	});
},

removeCol: function() {
	this.x--;
	this.cells.forEach( function(row) {
		row.pop();
	});
},

addRow: function() {
	this.y++;
	this.cells.push( this.createRow( this.y ) );
},

removeRow: function() {
	this.y--;
	this.cells.pop();
},

fromJson: function(list) {
	list.forEach( function(coor) {
		this.getCell( coor[0], coor[1]).reset( true );
	}, this);
},

toJson: function() {
	return this.cells.reduce( function( out, row ){
		return row.reduce( function( out, cell ) {
			if( cell.display.alive )
				out.push(  [cell.x, cell.y] );
			return out;
		}, out);
	}, []);
}
};

return Grid;
});
