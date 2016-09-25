var Cell, Grid;

Cell = require('./cell.js');

Grid = (function() {
  function Grid(x, y, sparse) {
    var i;
    this.x = x;
    this.y = y;
    this.cells = new Array(y);
    this.sparseFactor = sparse;
    i = 0;
    while (i < y) {
      this.cells[i] = this.createRow(i);
      i++;
    }
    return this;
  }

  Grid.prototype.createRow = function(y) {
    var j, row;
    j = 0;
    row = new Array(this.x);
    while (j < this.x) {
      row[j] = new Cell(j, y, false);
      j++;
    }
    return row;
  };

  Grid.prototype.getCell = function(x, y) {
    return this.cells[y][x];
  };

  Grid.prototype.setCell = function(x, y, alive) {
    return this.cells[y][x].alive = alive;
  };

  Grid.prototype.forEachCell = function(f, args) {
    var cell, k, l, len, len1, ref, row;
    args = args || [];
    ref = this.cells;
    for (k = 0, len = ref.length; k < len; k++) {
      row = ref[k];
      for (l = 0, len1 = row.length; l < len1; l++) {
        cell = row[l];
        f.apply(cell, args);
      }
    }
  };

  Grid.prototype.setBlankState = function() {
    return this.forEachCell(Cell.prototype.reset, [false]);
  };

  Grid.prototype.setRandomState = function() {
    var cell, i, initialState, k, l, len, len1, ref, row;
    initialState = new Uint8Array(this.x * this.y);
    window.crypto.getRandomValues(initialState);
    i = 0;
    ref = this.cells;
    for (k = 0, len = ref.length; k < len; k++) {
      row = ref[k];
      for (l = 0, len1 = row.length; l < len1; l++) {
        cell = row[l];
        cell.reset(initialState[i++] < this.sparseFactor);
      }
    }
  };

  Grid.prototype.addCol = function() {
    var k, len, ref, row, y;
    this.x++;
    ref = this.cells;
    for (y = k = 0, len = ref.length; k < len; y = ++k) {
      row = ref[y];
      row.push(new Cell(this.x, y, false));
    }
  };

  Grid.prototype.delCol = function() {
    var k, len, ref, row;
    this.x--;
    ref = this.cells;
    for (k = 0, len = ref.length; k < len; k++) {
      row = ref[k];
      row.pop();
    }
  };

  Grid.prototype.addRow = function() {
    this.y++;
    return this.cells.push(this.createRow(this.y));
  };

  Grid.prototype.delRow = function() {
    this.y--;
    return this.cells.pop();
  };

  Grid.prototype.fromJson = function(list) {
    var coor, k, len;
    this.setBlankState();
    for (k = 0, len = list.length; k < len; k++) {
      coor = list[k];
      this.getCell(coor[0], coor[1]).alive = true;
    }
  };

  Grid.prototype.toJson = function() {
    return this.cells.reduce(function(out, row) {
      return row.reduce(function(sameOut, cell) {
        if (cell.display.alive) {
          sameOut.push([cell.x, cell.y]);
        }
        return sameOut;
      }, out);
    }, []);
  };

  return Grid;

})();

module.exports = Grid;
