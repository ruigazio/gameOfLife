var Cell, Life;

Cell = require('./cell.js');

Life = (function() {
  Life.historyLimit = 100;// eslint-disable-line no-use-before-define

  Cell.historyLimit = Life.historyLimit;// eslint-disable-line no-use-before-define

  function Life(grid) {
    this.grid = grid;
    this.numTicks = 0;
    return this;
  }

  Life.prototype.historyStatus = function() {
    var cell;
    cell = this.grid.getCell(0, 0);
    return {
      back: cell.previous.length,
      forward: cell.following.length
    };
  };

  Life.prototype.stepBack = function() {
    if (this.historyStatus().back) {
      this.grid.forEachCell(Cell.prototype.stepBack);
      return this.numTicks--;
    }
  };

  Life.prototype.resetPreStep = function() {
    this.grid.forEachCell(Cell.prototype.resetPreStep);
    return this.preStep();
  };

  Life.prototype.preStep = function() {
    return this.step(Cell.prototype.getNextState);
  };

  Life.prototype.stepForward = function() {
    if (this.historyStatus().forward) {
      this.grid.forEachCell(Cell.prototype.stepForward);
    } else {
      this.step(Cell.prototype.liveOrDie);
    }
    return this.numTicks++;
  };

  Life.prototype.step = function(cellAction) {
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
  };

  Life.prototype.setPattern = function(getPattern) {
    this.numTicks = 0;
    getPattern();
    return this.preStep();
  };

  Life.prototype.setRandom = function() {
    return this.setPattern(this.grid.setRandomState.bind(this.grid));
  };

  Life.prototype.setBlank = function() {
    return this.setPattern(this.grid.setBlankState.bind(this.grid));
  };

  Life.prototype.loadPattern = function(pattern) {
    return this.setPattern(this.grid.fromJson.bind(this.grid, pattern));
  };

  return Life;

})();

module.exports = Life;
