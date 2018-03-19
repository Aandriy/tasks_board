import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ModalTitle extends Component {
	static propTypes = {
		onClose: PropTypes.func,
		modal: PropTypes.object
	};
	static defaultProps = {
		modal: {}
	};
	render() {
		const props = this.props;
		const onClose = props.onClose || props.modal.onClose
		
		return (
			<div className="modal-header">
				<h5 className="modal-title">{props.children}</h5>
				<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
					<span aria-hidden="true">×</span>
				</button>
			</div>
		);
	}
}
