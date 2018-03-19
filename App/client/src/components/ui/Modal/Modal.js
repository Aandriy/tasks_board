import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Modal extends Component {

	static propTypes = {
		show: PropTypes.bool.isRequired,
		sizeClass: PropTypes.string
	};
	constructor(props) {
		super(props);
		this.common = {};
	};
	static defaultProps = {
		sizeClass: 'modal-lg',
	};
	
	render() {
		const props = this.props;
		if (!props.show) {
			return null;
		}
		const common = this.common;
		common.onClose = this.props.onClose;
		const children = typeof(props.children) === 'function'? props.children(common) : props.children;

		const modal = (
			<div>
				<div className="modal-backdrop"></div>
				<div className="modal fade show d-block ">
					<div className={`modal-dialog ${props.sizeClass}`} role="document">
						<div className="modal-content">
							{children}
						</div>
					</div>
				</div>
			</div>
		);
		return ([ReactDOM.createPortal(modal, document.body)]);
	}
}
