import React, { Component } from 'react';
import BoardService from '../../services/board.service';
import { Modal, ModalTitle, ModalBody, ModalFooter, Loading, Boolean } from '../ui';
import { pipes } from '../../utility';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Users from '../Users/Users';

export default class ViewBoardPopup extends Component {
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
		BoardService.getBoardDetails(id).done((response) => {
			const newState = {
				loaded: true
			};
			Object.assign(newState, response);
			this.setState(newState);
		});
	};
	render() {
		const state = this.state;
		const props = this.props;
		if (!state.loaded) {
			return <Loading locked={true} />;
		}
		return (
			<Modal show={true} sizeClass="modal-xl">
				<ModalTitle onClose={props.onClose}>Board Details</ModalTitle>
				<ModalBody>
					<div className="container-fluid py-md-3">
						<h1><Link to={`/Board/${state.boardId}`}> <b>{state.title}</b></Link> </h1>
						<div>
							<p>{state.description}</p>
						</div>
						<p>publish: <Boolean value={state.publish} /></p>
						<p>Allow column for testing: <Boolean value={state.allowTesting} /></p>
						<p>priority: {state.priority}</p>
						<p>createBy <b>{state.createBy}</b> <time>{pipes.dateTime(state.dateOfCreation)}</time></p>
						<p>modifyBy <b>{state.modifyBy}</b> <time>{pipes.dateTime(state.dateOfModify)}</time></p>
						<Users boardId={state.boardId} editable={state.canWriteAccess} allowTesting={state.allowTesting} />
					</div>
				</ModalBody>
				<ModalFooter onClose={props.onClose} />
			</Modal>
		);
	}
}

