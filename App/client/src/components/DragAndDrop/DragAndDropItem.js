import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class DragAndDropItem extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		dragAndDrop: PropTypes.object.isRequired
	};
	constructor(props) {
		super(props);
		this.mousedown = this.mousedown.bind(this);
	}
	mousedown(e) {
		const item = e.currentTarget;
		const parent = e.target;
		if (item.contains(parent) || item === parent) {
			const rect = item.getBoundingClientRect();
			const data = {
				width: item.clientWidth,
				pos: {
					x: e.clientX,
					y: e.clientY
				},
				shift: {
					x: e.clientX - rect.left,
					y: e.clientY - rect.top
				},
				data: this.props.data
			};
			this.props.dragAndDrop.set(data);
		}
	}

	render() {
		return (<div draggable="false" className={classNames('drag-and-drop-item', { 'is-dragged-item': (String(this.props.id) === String(this.props.draggedElementId)) })} data-id={this.props.id}  >
			<i className="drag-and-drop-before"></i>
			<div className="drag-and-drop-item-holder" onMouseDown={this.mousedown}>{this.props.children}</div>
			<i className="drag-and-drop-after"></i>
		</div>);
	}
}
