import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class SubMenuLink extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		to: PropTypes.string.isRequired,
		active: PropTypes.bool
	};
	static defaultProps = {
		active: false
	};
	render() {
		const props = this.props;
		if (props.active) {
			return (<span className="sub-menu-item active"><span className="sub-menu-item-active">{props.title}{props.children}</span></span>);
		}
		return (<span className="sub-menu-item"><Link to={props.to}>{props.title}{props.children}</Link></span>);
	}
}
