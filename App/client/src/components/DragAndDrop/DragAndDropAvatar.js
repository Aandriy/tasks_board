import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DragAndDropAvatar extends Component {
	static propTypes = {
		css: PropTypes.object.isRequired
	};
	render() {
		const css = this.props.css || { };
		return (<div style={css} className="drag-and-drop-avatar">{this.props.children}</div>);
	}
}
