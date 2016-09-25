var React = require('react/addons');
var RClock = React.createClass({

	render: function() {
		return (
			<table className="time">
				<tr>
					<th colSpan="3">Frame drawing time in ms (FPS)</th>
				</tr>
				<tr>
					<th></th>
					<th colSpan="2">sample {this.props.sampleSize} frames</th>
				</tr>
				<tr>
					<th>current</th>
					<th>worst</th>
					<th>average</th>
				</tr>
				<tr>
					<td>{this.props.times.frame} ({this.props.fps.frame})</td>
					<td>{this.props.times.worst} ({this.props.fps.worst})</td>
					<td>{this.props.times.average} ({this.props.fps.average})</td>
				</tr>
			</table>
		);
	}
});

module.exports = RClock;
