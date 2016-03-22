var React = require('react/addons');
var GridClass = require('./GridComponents.jsx');
var Examples = require('../life/examples.js');

var LifeControls = React.createClass({
	getInitialState: function() {
		return {
			speed: 1
			, showNeighbors: false
			, cellSize: 12
		};
  },

	componentWillMount: function() {
		this.props.life.loadPattern( Examples.gosper );
		this.play = this.noop;
  },

	interruptPlay: function(action) {
		return function(){
			if( this.isPlaying() ){
				this.stop();
			}
			action();
			this.forceUpdate();
		}.bind(this);
	},

	cellClickCheck: function() {
		if( this.cellClicked ){
			this.cellClicked = false;
			this.props.life.resetPreStep();
		}
	},

	lifeAction: function(method) {
		return this.interruptPlay( function(){
			this.cellClickCheck();
			this.props.life[method]();
		}.bind(this) );
	},

	gridAction: function(method) {
		return this.interruptPlay( function(){
			this.props.life.grid[method]();
		}.bind(this) );
	},

	setPattern: function(method) {
		return this.interruptPlay( function(){
			this.props.life[method]();
		}.bind(this) );
	},

	loadPattern: function(pattern) {
		return this.interruptPlay( function(){
			this.props.life.loadPattern(pattern);
		}.bind(this) );
	},

	handleCellClick: function(cell){
		this.interruptPlay( function(){
			this.cellClicked = true;
			cell.invertState();
			this.props.life.resetPreStep();
		}.bind(this))();
	},

	isPlaying: function() {
		return this.play === this.step;
	},

	noop: function() {
	},

	stop: function() {
		this.play = this.noop;
		clearTimeout( this.timer );
		this.forceUpdate();
	},

	startStop: function() {
		if( this.play === this.step ){
			this.stop();
		} else {
			this.play = this.step;
			this.cellClickCheck();
			this.step();
		}
	},

	step: function() {
		this.props.life.stepForward();
		this.forceUpdate( function(){
			this.timer = setTimeout( this.play, this.state.speed );
		}.bind(this) );
	},

	changeSpeed: function(e) {
		var speed = Number.parseInt(e.target.value);
		this.setState({ speed: speed });
	},

	toggleNeighbors: function(e) {
		this.setState({ showNeighbors: e.target.checked });
	},

	cellSizeChanged: function(e) {
		this.setState({cellSize: e.target.value});
	},

	render: function() {
		return (
			<div>

			<style dangerouslySetInnerHTML={{
				__html: '.cell { width: ' + this.state.cellSize + 'px;'
					+ 'height:' + this.state.cellSize + 'px;'
					+ 'font-size:' + this.state.cellSize * 0.6 + 'pt;}'
					+ '.row { height: ' + this.state.cellSize + 'px;}'
			}} />

			<GridClass
				grid={this.props.life.grid}
				showNeighbors={this.state.showNeighbors}
				handleCellClick={this.handleCellClick}
			/>

			<div id="controls" className="narrow-column">

			<p className="hint">Click a cell to toggle its state at any time</p>

			<div className="form-group">
					<h3>Pattern</h3>
					<button onClick={this.setPattern('setRandom')}>random</button>
					<button onClick={this.setPattern('setBlank')}>blank</button>
					<button onClick={this.loadPattern( Examples.gosper )}>Gosper</button>
					<button onClick={this.loadPattern( Examples.pulsar )}>Pulsar</button>
			</div>

			<div className="form-group">
					<h3>Evolution</h3>
					<p className="info">tick #{this.props.life.numTicks}</p>
					<button onClick={this.lifeAction('stepBack')}> &lt;
							<span className="info">{this.props.life.historyStatus().back} </span>
					</button>
					<button onClick={this.startStop}> {this.isPlaying() ? '\u25af' : '\u25b7'} </button>
					<button onClick={this.lifeAction('stepForward')}> &gt; </button>
			</div>
			<div className="form-group">
					<h3>Speed</h3>
					<input type="number"
							onChange={this.changeSpeed}
							value={this.state.speed}
							min="0" max="1000" required />delay (ms)
			</div>

			<div className="form-group">
					<h3>Size</h3>
					<p>
							<button onClick={this.gridAction('delRow')}>-</button>
							{this.props.life.grid.y} Rows
							<button onClick={this.gridAction('addRow')}>+</button>
					</p>
					<p>
							<button onClick={this.gridAction('delCol')}>-</button>
							{this.props.life.grid.x} Columns
							<button onClick={this.gridAction('addCol')}>+</button>
					</p>
					<p>
							Cell size <input type="number" min="5" max="25" required
							value={this.state.cellSize}
							onChange={this.cellSizeChanged}
					/>px
					</p>
			</div>

			<div className="form-group">
					<input type="checkbox"
						checked={this.state.showNeighbors}
						onChange={this.toggleNeighbors}
					/>
					Display number of neighbours
			</div>
			</div>
			</div>
		);
	}
});

module.exports = LifeControls;
