'use strict';

var React = require('react/addons');

/****************** CELL *********************************/
var CellClass = React.createClass({

	handleCellClick: function(){
		this.props.handleCellClick(this.props.cell);
	},

	shouldComponentUpdate: function(nextProps){
		return !(
			nextProps.display === this.props.display
			&& nextProps.showNeighbors === this.props.showNeighbors
		);
	},

	render: function() {
		return React.DOM.div({
				className: 'cell ' + (this.props.display.alive ? 'alive' : 'dead' )
				, onClick: this.handleCellClick
			}, this.props.showNeighbors ? this.props.display.neighbors : ''
		);
	}
});

var cellRF = React.createFactory(CellClass);

/****************** GRID *********************************/
var GridClass = React.createClass({

	createChildren: function() {
		var props = this.props;
		return props.grid.cells.map( function( row, y) {

			var reactRow = row.map( function( cell, x) {
				var key = '' + y + x;
				return cellRF({
					handleCellClick: props.handleCellClick
					, display: cell.display
					, showNeighbors: props.showNeighbors
					, cell: cell
					, key: key
				});
			});

			return React.DOM.div({
					className: 'row'
					, key: y
				},
				reactRow
			);
		});
  },

	render: function() {
		return React.DOM.div({ id: 'grid' },
			this.createChildren()
		);
	}
});

module.exports = GridClass;
