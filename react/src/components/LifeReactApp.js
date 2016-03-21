'use strict';

var Grid = require('../life/grid.js');
var Life = require('../life/life.js');
var React = require('react/addons');
var LifeControls = require('./LifeControls.jsx');

require('../../../common/life.css');
require('../../../common/nav.css');

var LifeReactApp = React.createClass({
	componentWillMount: function() {
		var grid = new Grid(40, 40, 50);
		this.life = new Life(grid);
	},
  render: function() {

		return React.DOM.div({
					className: 'container'
				},
				React.createElement(LifeControls, {life: this.life} )
			);
  }
});

React.render(<LifeReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = LifeReactApp;
