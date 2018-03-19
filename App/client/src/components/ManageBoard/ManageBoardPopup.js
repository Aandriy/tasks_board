
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalTitle, ModalBody, ModalFooter, Loading } from '../ui';
import BoardForm from './BoardForm';
import EditBoardModel from './EditBoard.model';
import BoardService from '../../services/board.service';


export default class ManageBoardPopup extends Component {
	static propTypes = {
		show: PropTypes.bool.isRequired,
		close: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired
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
		BoardService.geEditBoardDetails(id).done((response) => {
			const model = new EditBoardModel(response);
			this.setState({ model: model });
		});
	};

	onClose() {
		this.props.close();
	}

	componentWillMount() {
		const data = this.props.data;
		if (data.id) {
			this.getData(data.id);
		} else {
			this.setState({
				model: new EditBoardModel()
			});
		}
	};

	render() {
		const props = this.props;
		const state = this.state;

		if (!state.model) {
			return <Loading locked={true} />;
		}

		return <Modal show={props.show}>
			<ModalTitle onClose={this.onClose}>{props.title}</ModalTitle>
			<ModalBody>
				<BoardForm model={state.model} onDone={this.onClose} performSubmit={this.performSubmit} />
			</ModalBody>
			<ModalFooter onClose={this.onClose}>
				<button type="button" className="btn btn-primary" onClick={this.performSubmit}>Save changes</button>
			</ModalFooter>
		</Modal>
	};
}