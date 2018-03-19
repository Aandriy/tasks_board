import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ValidationSummary extends Component {
	static propTypes = {
		summary: PropTypes.array.isRequired
	};
	render() {
		const summary = this.props.summary;
		if (summary.length) {
			return (<div className="alert alert-danger">{summary.join(' ')}</div>)
		}
		return null;
	}
}
