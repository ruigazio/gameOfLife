var Cell, Life;

Cell = require('./cell.js');

Life = function(grid) {
  this.grid = grid;
  this.numTicks = 0;
  return this;
};

Life.historyLimit = 100;

Cell.historyLimit = Life.historyLimit;

Life.prototype = {
  historyStatus: function() {
    var cell;
    cell = this.grid.getCell(0, 0);
    return {
      back: cell.previous.length,
      forward: cell.following.length
    };
  },
  stepBack: function() {
    if (this.historyStatus().back) {
      this.grid.forEachCell(Cell.prototype.stepBack);
      return this.numTicks--;
    }
  },
  resetPreStep: function() {
    this.grid.forEachCell(Cell.prototype.resetPreStep);
    return this.preStep();
  },
  preStep: function() {
    return this.step(Cell.prototype.getNextState);
  },
  stepForward: function() {
    if (this.historyStatus().forward) {
      this.grid.forEachCell(Cell.prototype.stepForward);
    } else {
      this.step(Cell.prototype.liveOrDie);
    }
    return this.numTicks++;
  },
  step: function(cellAction) {
    var cells, countAndSetCells, countAndSetRow, first, firstRow, lastCell, lastRow, lastRowOrig;
    countAndSetRow = function(state, cell) {
      var above, aboveLeft, left;
      above = state.aboveRow.shift();
      aboveLeft = state.aboveLeft;
      left = state.left;
      state.aboveLeft = above;
      state.left = cell;
      aboveLeft.neighbors += cell.alive + above.alive + left.alive;
      left.neighbors += aboveLeft.alive + above.alive;
      above.neighbors += left.alive + aboveLeft.alive;
      cell.neighbors += aboveLeft.alive;
      cellAction.call(aboveLeft);
      return state;
    };
    countAndSetCells = function(previousRowOriginal, rowOriginal) {
      var finalState, initialState, previousRow, row;
      row = rowOriginal.slice();
      previousRow = previousRowOriginal.slice();
      initialState = {
        aboveLeft: previousRow.shift(),
        aboveRow: previousRow,
        left: row.shift()
      };
      finalState = row.reduce(countAndSetRow, initialState);
      finalState.aboveLeft.neighbors += finalState.left.alive;
      finalState.left.neighbors += finalState.aboveLeft.alive;
      cellAction.call(finalState.aboveLeft);
      return rowOriginal;
    };
    cells = this.grid.cells.slice();
    firstRow = cells.shift();
    lastRowOrig = cells.reduce(countAndSetCells, firstRow);
    lastRow = lastRowOrig.slice();
    first = lastRow.shift();
    lastCell = lastRow.reduce(function(left, right) {
      right.neighbors += left.alive;
      left.neighbors += right.alive;
      cellAction.call(left);
      return right;
    }, first);
    return cellAction.call(lastCell);
  },
  setPattern: function(getPattern) {
    this.numTicks = 0;
    getPattern();
    return this.preStep();
  },
  setRandom: function() {
    return this.setPattern(this.grid.setRandomState.bind(this.grid));
  },
  setBlank: function() {
    return this.setPattern(this.grid.setBlankState.bind(this.grid));
  },
  loadPattern: function(pattern) {
    return this.setPattern(this.grid.fromJson.bind(this.grid, pattern));
  }
};

module.exports = Life;
