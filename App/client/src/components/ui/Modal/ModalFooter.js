import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ModalFooter extends Component {
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
			<div className="modal-footer">
				{props.children}
				<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={onClose}>Close</button>
			</div>
		);
	}
}
