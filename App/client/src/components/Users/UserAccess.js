
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalTitle, ModalBody, ModalFooter } from '../ui';
import UserService from '../../services/user.service';
import UserAccessModel from './UserAccess.model';

import UserAccessForm from './UserAccessForm';

export default class UserAccess extends Component {
	static propTypes = {
		show: PropTypes.bool.isRequired,
		close: PropTypes.func.isRequired,
	};
	constructor(props) {
		super(props);
		this.state = {
			data: null
		}
		this.onClose = this.onClose.bind(this);
		this.onManage = this.onManage.bind(this);
		var performSubmit = function () {
			if(typeof(performSubmit.callback)==='function'){
				performSubmit.callback()
			}
		}
		performSubmit.callback = null;
		this.performSubmit = performSubmit;
	};
	getData() {
		const props = this.props;
		UserService.getUserAccessData(props.data).done((responce) => {
			this.setState({ data: responce });
		});
	};
	onClose() {
		this.props.close();
	}
	componentWillMount() {
		this.getData();
	};
	onManage(data) {
		this.props.close();
	}
	
	render() {
		const props = this.props;
		const state = this.state;

		if (!props.show) {
			return null;
		}
		if (!state.data) {
			return null;
		}

		const model = new UserAccessModel(state.data);
		return <Modal show={props.show}>
			<ModalTitle onClose={this.onClose}>{state.data.user}</ModalTitle>
			<ModalBody>
				<UserAccessForm model={model} onManage={this.onManage} performSubmit={this.performSubmit} allowTesting={props.allowTesting} />
			</ModalBody>
			<ModalFooter onClose={this.onClose}>
				<button type="button" className="btn btn-primary" onClick={this.performSubmit}>Save changes</button>
			</ModalFooter>
		</Modal>
	};
}