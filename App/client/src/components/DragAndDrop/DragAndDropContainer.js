import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DragAndDropAvatar from './DragAndDropAvatar';
import classNames from 'classnames';

export default class DragAndDropContainer extends Component {
	static propTypes = {
		dragAndDrop: PropTypes.object.isRequired,
		getDraggedElement: PropTypes.func.isRequired,
		onChange: PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			showAvata: false,
			width: 0,
			data: null,
			pos: {},
			shift: {},
			coordinates: {}
		};
		this.props.dragAndDrop.subscribe((data) => {

			this.setState(data);

			this.bind();
		});
		this.onmousemove = this.onmousemove.bind(this);
		this.onmouseup = this.onmouseup.bind(this);
	}

	componentWillUnmount() {
		this.unbind();
	}

	bind() {
		this.unbind();
		document.addEventListener('mousemove', this.onmousemove);
		document.addEventListener('mouseup', this.onmouseup);
	};
	unbind() {
		document.removeEventListener('mousemove', this.onmousemove);
		document.removeEventListener('mouseup', this.onmouseup);
	};

	onmousemove(e) {
		if (!this.state.data) {
			this.unbind();
		} else {

			const state = this.state;
			const pos = {
				x: e.clientX,
				y: e.clientY
			}
			const defaultPos = state.pos || { x: 0, Y: 0 };
			const newState = {};
			if (!state.showAvata) {
				if ((Math.abs(pos.x - defaultPos.x) > 3) || (Math.abs(pos.y - defaultPos.y) > 3)) {
					newState.showAvata = true;
					this.props.getDraggedElement(state.data);
				}
			}
			if (state.showAvata || newState.showAvata) {
				const shift = state.shift || {};
				pos.x -= shift.x;
				pos.y -= shift.y;
				newState.coordinates = pos;
				this.setState(newState)
			}
		}
	};

	onmouseup(e) {
		this.unbind();
		const elem = document.elementFromPoint(e.clientX, e.clientY);

		if (elem) {
			let item = elem.closest('.drag-and-drop-column');
			if (item) {
				const result = {};
				result.category = item.getAttribute('data-category');
				item = elem.closest('.drag-and-drop-item');
				if (item) {
					const point = Math.abs(item.getBoundingClientRect().top - e.clientY);
					result.before = (item.clientHeight / 2) > point;
					result.id = item.getAttribute('data-id');
				}
				result.data = this.state.data;
				this.props.onChange(result);
			}
		}

		this.setState({
			showAvata: false,
			width: 0,
			data: null,
			pos: {},
			shift: {},
			coordinates: {}
		});

		this.props.getDraggedElement(null);
	}

	render() {
		const state = this.state;
		const Avatar = this.props.avatar;
		const avatar = () => {
			if (!state.showAvata) {
				return null;
			}

			const css = {
				left: state.coordinates.x + 'px',
				top: state.coordinates.y + 'px',
				width: state.width + 'px'
			};

			return (<DragAndDropAvatar css={css}><Avatar {...state.data.itemProps} /></DragAndDropAvatar>);
		};
		return (<div className={classNames('drag-and-drop-container', { 'is-dragged': state.showAvata })} >
			{avatar()}
			{this.props.children}
		</div>);
	}
}
