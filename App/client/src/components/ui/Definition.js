import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Definition extends Component {
	static propTypes = {
		className: PropTypes.string,
		label: PropTypes.string.isRequired
	};
	static defaultProps = {
		className: 'formatted-text'
	};
	render() {
		const props = this.props;
		if (props.children) {
			return (
				<div><b>{props.label}</b>: <div className={props.className}>{props.children}</div></div>
			);
		}
		return null;
	}
}
