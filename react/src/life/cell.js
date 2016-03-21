var Cell, Display;

Display = function(alive, neighbors) {
  this.neighbors = neighbors;
  this.alive = alive;
  return this;
};

Cell = function(x, y, alive) {
  this.display = new Display(alive, 0);
  this.x = x;
  this.y = y;
  this.alive = alive;
  this.neighbors = 0;
  this.previous = [];
  this.following = [];
  return this;
};

Cell.Display = Display;

Cell.prototype = {
  reset: function(alive) {
    this.alive = !!alive;
    this.previous = [];
    this.following = [];
    this.neighbors = 0;
    this.display.alive = !!alive;
    return this.display.neighbors = 0;
  },
  resetPreStep: function() {
    this.alive = this.display.alive;
    return this.following = [];
  },
  stepBack: function() {
    this.following.push(this.display);
    return this.display = this.previous.pop();
  },
  stepForward: function() {
    this.previous.push(this.display);
    return this.display = this.following.pop();
  },
  invertState: function() {
    return this.display.alive = !this.display.alive;
  },
  getNextState: function() {
    var nextState;
    nextState = this.alive && (this.neighbors > 1 && this.neighbors < 4) || (!this.alive && this.neighbors === 3);
    this.display = new Display(this.alive, this.neighbors);
    this.alive = nextState;
    return this.neighbors = 0;
  },
  liveOrDie: function() {
    if (this.previous.length > Cell.historyLimit) {
      this.previous.shift();
    }
    this.previous.push(this.display);
    return this.getNextState();
  }
};

module.exports = Cell;
