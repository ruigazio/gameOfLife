var Cell, Display;

Display = (function() {
  function Display(alive, neighbors) {
    this.neighbors = neighbors;
    this.alive = alive;
    return this;
  }

  return Display;

})();

Cell = (function() {
  Cell.Display = Display; // eslint-disable-line no-use-before-define

  function Cell(x, y, alive) {
    this.display = new Display(alive, 0);
    this.x = x;
    this.y = y;
    this.alive = alive;
    this.neighbors = 0;
    this.previous = [];
    this.following = [];
    return this;
  }

  Cell.prototype.reset = function(alive) {
    this.alive = !!alive;
    this.previous = [];
    this.following = [];
    this.neighbors = 0;
    return this.display = new Display(this.alive, 0);
  };

  Cell.prototype.resetPreStep = function() {
    this.alive = this.display.alive;
    return this.following = [];
  };

  Cell.prototype.stepBack = function() {
    this.following.push(this.display);
    return this.display = this.previous.pop();
  };

  Cell.prototype.stepForward = function() {
    this.previous.push(this.display);
    return this.display = this.following.pop();
  };

  Cell.prototype.invertState = function() {
    return this.display = new Display(!this.display.alive, this.display.neighbors);
  };

  Cell.prototype.getNextState = function() {
    var nextState;
    nextState = this.alive && (this.neighbors > 1 && this.neighbors < 4) || (!this.alive && this.neighbors === 3);
    if (!(this.display.alive === this.alive && this.display.neighbors === this.neighbors)) {
      this.display = new Display(this.alive, this.neighbors);
    }
    this.alive = nextState;
    return this.neighbors = 0;
  };

  Cell.prototype.liveOrDie = function() {
    if (this.previous.length > Cell.historyLimit) {
      this.previous.shift();
    }
    this.previous.push(this.display);
    return this.getNextState();
  };

  return Cell;

})();

module.exports = Cell;
