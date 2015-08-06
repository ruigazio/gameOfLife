'use strict';
(function(cellClassBuilder){
	window.LifeApp = window.LifeApp || {};
	window.LifeApp.Grid = window.LifeApp.Grid || {};
	window.LifeApp.Cell = cellClassBuilder();
})
(function(){
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


Cell.prototype = {

reset: function(alive) {
	this.alive = !!alive;
	this.previous = [];
	this.following = [];
	this.neighbours = 0;
	this.display.alive = !!alive;
	this.display.nextState = !!alive;
	this.display.neighbours = 0;
	this.display.style = "none";
},

stepBack: function() {
	this.following.push( this.display );
	this.display = this.previous.pop();
},

stepForward:  function() {
	this.previous.push( this.display );
	this.display = this.following.pop();
},

invertState: function() {
	this.display.alive = !this.display.alive;
},

getNextState: function() {
	var nextState = this.alive && (this.neighbours > 1 && this.neighbours < 4) 
		|| ( !this.alive && this.neighbours === 3);

	if( this.alive !== nextState ){
		this.display.style = nextState ? "overline" : "line-through";
		Cell.prototype.colonyChanged = true;
	} else {
		this.display.style = "none";
	}

	this.display.neighbours = this.neighbours;
	this.display.alive = this.alive;
	this.display.nextState = nextState;
	this.alive = nextState;
	this.neighbours = 0;
},

liveOrDie: function() {
	var display = this.display.clone();

	if( this.previous.length > Cell.historyLimit){
		this.previous.shift();
	}
	this.previous.push( display );

	this.getNextState();
}
};

Cell.Display = Display;
return Cell;
});
