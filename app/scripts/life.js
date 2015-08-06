'use strict';
(function(lifeClassBuilder){
	window.LifeApp = window.LifeApp || {};
	window.LifeApp.Life = lifeClassBuilder( window.LifeApp );
})( function(LifeApp){

var Life = function(grid){
	this.grid = grid;	
	this.numTicks = 0;	
};

var Cell = LifeApp.Cell;

Life.historyLimit = 100;
Cell.historyLimit = Life.historyLimit;

Life.prototype = {

colonyStable: function(){
	return ! Cell.prototype.colonyChanged;
},

historyStatus: function(){
	var cell = this.grid.getCell(0,0);
	return {
		back: cell.previous.length
		, forward: cell.following.length
	};
},

setRandomState: function(){
	this.numTicks = 0;
	this.grid.setRandomState();
},

setBlankState: function(){
	this.numTicks = 0;
	this.grid.setBlankState();
},

setGosper: function(){
	this.numTicks = 0;
	this.grid.fromJson(LifeApp.patterns.gosper);
},

stepBack: function(){
	if( this.historyStatus().back ){
		this.grid.map( Cell.prototype.stepBack );
		this.numTicks--;
	}
},

preStep: function(){
	this.step( Cell.prototype.getNextState);
},

stepForward: function(){
	if( this.historyStatus().forward )
		this.grid.map( Cell.prototype.stepForward );
	else 
		this.step( Cell.prototype.liveOrDie );
	this.numTicks++;
},

cellClick: function(cell){
	cell.invertState();
	this.grid.map( function(){
		this.following = [];
		this.alive = this.display.alive;
	});
	this.preStep();
},

step: function(cellAction){

	var countAndSetRow = function( state, cell){
		var above = state.aboveRow.shift();
		var aboveLeft = state.aboveLeft;
		var left = state.left;

		state.aboveLeft = above;
		state.left = cell;

		aboveLeft.neighbours  += cell.alive +  above.alive + left.alive;
		left.neighbours  += aboveLeft.alive + above.alive;
		above.neighbours  += left.alive + aboveLeft.alive;
		cell.neighbours  +=  aboveLeft.alive;

		cellAction.call(aboveLeft);

		return state;
	};

	var countAndSetCells = function( previousRowOriginal, rowOriginal){
		var row = rowOriginal.slice();
		var previousRow = previousRowOriginal.slice();

		var initialState = {
			aboveLeft: previousRow.shift()
			, aboveRow: previousRow
			, left: row.shift()
		};

		var finalState = row.reduce( countAndSetRow, initialState );

		finalState.aboveLeft.neighbours += finalState.left.alive; 
		finalState.left.neighbours += finalState.aboveLeft.alive; 
		cellAction.call(finalState.aboveLeft);

		return rowOriginal;
	};

	Cell.prototype.colonyChanged = false;
	var cells = this.grid.cells.slice();
	var previousRow = cells.shift();
	var lastRowOrig = cells.reduce(countAndSetCells, previousRow);


	var lastRow = lastRowOrig.slice();
	var left = lastRow.shift();
	
	var lastCell = lastRow.reduce( function(left, right){
			right.neighbours += left.alive;
			left.neighbours += right.alive;
			cellAction.call( left );
			return right;
		}, left);

	cellAction.call( lastCell );
}
};

return Life;
});

