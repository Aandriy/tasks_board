import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Progress extends Component {
	static propTypes = {
		value: PropTypes.number,
		label: PropTypes.string
	};
	roundPlus(x, n) {
		var m = Math.pow(10, n);
		return Math.round(x * m) / m;
	}

	render() {
		const props = this.props;
		if (props.value) {
			return (
				<div className="progress">
					<div className="progress-bar progress-bar-success"
						role="progressbar"
						aria-valuenow={props.value}
						aria-valuemin="0"
						aria-valuemax="100"
						style={{ width: props.value + '%' }}
					>
						<span className="progress-text">{this.roundPlus(props.value, 2)}% {props.label}</span>
					</div>
					<span className="progress-text">{this.roundPlus(props.value, 2)}% {props.label}</span>
				</div>
			);
		}
		return null;
	}
}
