var Cell, Grid;

Cell = require('./cell.js');

Grid = function(x, y, sparse) {
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
};

Grid.prototype = {
  createRow: function(y) {
    var j, row;
    j = 0;
    row = new Array(this.x);
    while (j < this.x) {
      row[j] = new Cell(j, y, false);
      j++;
    }
    return row;
  },
  getCell: function(x, y) {
    return this.cells[y][x];
  },
  setCell: function(x, y, alive) {
    return this.cells[y][x].alive = alive;
  },
  forEachCell: function(f, args) {
    var cell, row, _i, _j, _len, _len1, _ref;
    args = args || [];
    _ref = this.cells;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
        cell = row[_j];
        f.apply(cell, args);
      }
    }
  },
  setBlankState: function() {
    return this.forEachCell(Cell.prototype.reset, [false]);
  },
  setRandomState: function() {
    var cell, i, initialState, row, _i, _j, _len, _len1, _ref;
    initialState = new Uint8Array(this.x * this.y);
    window.crypto.getRandomValues(initialState);
    i = 0;
    _ref = this.cells;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      for (_j = 0, _len1 = row.length; _j < _len1; _j++) {
        cell = row[_j];
        cell.reset(initialState[i++] < this.sparseFactor);
      }
    }
  },
  addCol: function() {
    var row, y, _i, _len, _ref;
    this.x++;
    _ref = this.cells;
    for (y = _i = 0, _len = _ref.length; _i < _len; y = ++_i) {
      row = _ref[y];
      row.push(new Cell(this.x, y, false));
    }
  },
  delCol: function() {
    var row, _i, _len, _ref;
    this.x--;
    _ref = this.cells;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      row = _ref[_i];
      row.pop();
    }
  },
  addRow: function() {
    this.y++;
    return this.cells.push(this.createRow(this.y));
  },
  delRow: function() {
    this.y--;
    return this.cells.pop();
  },
  fromJson: function(list) {
    var coor, _i, _len;
    this.setBlankState();
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      coor = list[_i];
      this.getCell(coor[0], coor[1]).alive = true;
    }
  },
  toJson: function() {
    return this.cells.reduce(function(out, row) {
      return row.reduce(function(sameOut, cell) {
        if (cell.display.alive) {
          sameOut.push([cell.x, cell.y]);
        }
        return sameOut;
      }, out);
    }, []);
  }
};

module.exports = Grid;
