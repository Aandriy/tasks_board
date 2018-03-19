import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Boolean extends Component {
	static propTypes = {
		value: PropTypes.bool
	};
	render() {
		if (this.props.value) {
			return (<span className="text-success">YES</span>);
		}
		return (<span className="text-warning">NO</span>);
	}
}
