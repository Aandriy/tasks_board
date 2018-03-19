
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalTitle, ModalBody, ModalFooter, Loading } from '../ui';
import TaskForm from './TaskForm';
import TaskFormModel from './TaskForm.model';
import TaskService from '../../services/task.service';


export default class ManageTaskPopup extends Component {
	static propTypes = {
		show: PropTypes.bool.isRequired,
		close: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		getModel: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			data: null
		}
		this.onClose = this.onClose.bind(this);
		var performSubmit = function () {
			if (typeof (performSubmit.callback) === 'function') {
				performSubmit.callback();
			}
		}
		performSubmit.callback = null;
		this.performSubmit = performSubmit;
	};

	getData(id) {
		TaskService[this.props.getModel](id).done((response) => {
			this.setState({
				data: {
					model: new TaskFormModel(response.model),
					users: response.users,
					statuses: response.statuses,
					settings: response.settings,
					boardWrite: response.boardWrite,
					boardTitle: response.boardTitle,
					canTaskClose: response.canTaskClose
				}
			});
		});
	};

	onClose() {
		this.props.close();
	}

	componentWillMount() {
		const data = this.props.data;
		this.getData(data.id);
	};

	render() {
		const props = this.props;
		const state = this.state;
		const data = state.data;

		if (!data) {
			return <Loading locked={true} />;
		}

		return <Modal show={props.show} onClose={this.onClose}>{(modal) => {
			return (
				<div>
					<ModalTitle modal={modal}>{props.title}</ModalTitle>
					<ModalBody>
						<TaskForm
							model={data.model}
							users={data.users}
							statuses={data.statuses}
							settings={data.settings}
							onDone={this.onClose}
							performSubmit={this.performSubmit}
							allowClose={data.canTaskClose} />
					</ModalBody>
					<ModalFooter modal={modal}>
						<button type="button" className="btn btn-primary" onClick={this.performSubmit}>Save changes</button>
					</ModalFooter>
				</div>);
		}}

		</Modal>
	};
}