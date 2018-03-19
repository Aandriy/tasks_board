import React, { Component } from 'react';


export default class ModalBody extends Component {
	
	render() {
		const props = this.props;
		return (
			<div className="modal-body">
				{props.children}
			</div>
		);
	}
}
