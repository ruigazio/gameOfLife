'use strict';

var React = require('react/addons');

/****************** CELL *********************************/
var CellClass = React.createClass({
	handleCellClick: function(){
		this.props.handleCellClick(this.props.cell);
	},
	shouldComponentUpdate: function(nextProps){
		return !(
			this.props.alive === nextProps.alive
			&& this.props.neighbors === nextProps.neighbors
		);
	},
	render: function() {
		return React.DOM.div({
				className: 'cell ' + (this.props.alive ? 'alive' : 'dead' )
				, onClick: this.handleCellClick
			}, this.props.neighbors
		);
	}
});

var cellRF = React.createFactory(CellClass);

/****************** ROW *********************************/
var RowClass = React.createClass({
	createChildren: function() {
		var outRow = [];
		var props = this.props;
		props.row.forEach( function( cell ) {
			var key = '' + cell.y + cell.x;
			outRow.push( cellRF({
				handleCellClick: props.handleCellClick
				, alive: cell.display.alive
				, neighbors: props.showNeighbors ? cell.display.neighbors : ''
				, cell: cell
				, key: key
			}));
		});
		return outRow;
  },
	render: function() {
		return React.DOM.div({ className: 'row' }, this.createChildren() );
  }
});

var rowRF = React.createFactory(RowClass);

/****************** GRID *********************************/
var GridClass = React.createClass({
	createChildren: function() {
		var outRows = [];
		var props = this.props;
		props.grid.cells.forEach( function( row, y) {
			outRows.push( rowRF({
				handleCellClick: props.handleCellClick
				, showNeighbors: props.showNeighbors
				, row: row
				, key: y
			}));
		});
		return outRows;
  },
	render: function() {
		return React.DOM.div({
				className: 'grid wide-column'
			},
			this.createChildren()
		);
	}
});

module.exports = GridClass;
