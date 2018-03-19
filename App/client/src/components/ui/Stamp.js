import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Stamp extends Component {
	static propTypes = {
		className: PropTypes.string
	};
	render() {
		const props = this.props;
		if (props.children) {
			return (
				<div className={'rubber-stamp ' + props.className}><div className="rubber-stamp-holder">{props.children}</div></div>
			);
		}
		return null;
	}
}
