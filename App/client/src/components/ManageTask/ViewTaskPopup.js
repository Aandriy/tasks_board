import React, { Component } from 'react';
import TaskService from '../../services/task.service';
import { Modal, ModalTitle, ModalBody, ModalFooter, Loading, Stamp, Avatar, Definition } from '../ui';
import { pipes } from '../../utility';
import Comment from '../Comment/Comment';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

export default class ViewTaskPopup extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		onClose: PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			data: null,
		};
	}
	componentDidMount() {
		let id = this.props.data.id;
		if (!id) {
			this.props.history.push('/NotFound');
		}
		this.getData(id);
	}
	getData(id) {
		TaskService.getTaskDetails(id).done((response) => {
			const access = response.access;
			const newState = {
				data: response.task,
				canWriteTask: access.canWriteTask,
				canReadBoard: access.canReadBoard,
				canWriteBoard: access.canWriteBoard,
				canWriteComment: access.canWriteComment,
				board: response.access.board,
				id: id
			};
			this.setState(newState);
		});
	};
	render() {
		const state = this.state;
		const data = state.data;
		const props = this.props;
		if (!data) {
			return <Loading locked={true} />;
		}
		let stamp = null;
		if (data.closed) {
			stamp = (<Stamp className="blue">closed</Stamp>);
		} else {
			switch (data.status) {
				case 'Rejected':
					stamp = (<Stamp className="red">Rejected</Stamp>);
					break;
				case 'Backlog':
					stamp = (<Stamp className="blue">Backlog</Stamp>);
					break;
				case 'Open':
					stamp = (<Stamp className="green">Open</Stamp>);
					break;
				default:
					stamp = (<Stamp className="yellow">{data.status}</Stamp>);
					break;
			}
		}
		return (
			<Modal show={props.show}>
				<ModalTitle onClose={props.onClose}>Details</ModalTitle>
				<ModalBody>
					<div className="container-fluid py-md-3">
						<div className="float-right">{stamp}</div>
						<h1 className="display-4">{data.title}</h1>
						<div>
							<div className="d-table">
								<Avatar value={data.ownerAvatar} />
							</div>
							<Definition label="Owner">{data.owner}</Definition>
						</div>
						<Definition label="Goal" className="text-container">{renderHTML(data.purpose || '')}</Definition>
						<Definition label="Acceptance Criteria" className="text-container">{renderHTML(data.acceptanceCriteria || '')}</Definition>
						<Definition label="Details" className="text-container">{renderHTML(data.details || '')}</Definition>

						<Definition label="Importance">{pipes.unCaseString(data.setting)}</Definition>

						<Definition label="Deadline">{pipes.dateTime(data.timeBound)}</Definition>
						<Definition label="Last Modified">{data.modifyBy} <time>{pipes.dateTime(data.dateOfModify)}</time></Definition>
						<Comment id={state.id} edit={state.canWriteComment} />
					</div>
				</ModalBody>
				<ModalFooter onClose={props.onClose} />
			</Modal>


		);
	}
}

