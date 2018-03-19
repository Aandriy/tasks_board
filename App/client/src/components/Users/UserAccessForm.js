import React, { Component } from 'react';
import { form } from '../../utility';
import PropTypes from 'prop-types';
import { CustomCheckbox, ValidationSummary } from '../ui';
import UserService from '../../services/user.service';

export default class UserAccessForm extends Component {
	static propTypes = {
		model: PropTypes.object.isRequired,
		onManage: PropTypes.func.isRequired,
		onClose: PropTypes.func.isRequired,
		allowTesting: PropTypes.bool
	};

	constructor(props) {
		super(props);
		const model = props.model;

		const state = {};
		form.mount(model, state, this);
		this.state = state;

		['onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	}

	submit(query) {
		UserService.setUserAccess(query).done((response) => {
			this.response(response).done(() => {
				this.resetForm();
				this.props.onManage();
			});
		});
	}

	onSubmit(e) {
		if (e) {
			e.preventDefault();
		}
		const query = this.getQuery();
		this.submit(query);
	}
	render() {
		const props = this.props;
		const state = this.state;
		const model = state.model;
		const allowTesting = props.allowTesting ? (<CustomCheckbox field={model.canTestTask} onFieldChange={model.canTestTask.set} label="Test Task" id="canTestTask" />) : null;
		return (
		<form onSubmit={this.onSubmit} >
			{props.children}
			<hr />
			<ValidationSummary summary={state.validationSummary} />
			<div className="row">
				<div className="col">
					<CustomCheckbox field={model.canReadBoard} onFieldChange={model.canReadBoard.set} label="Access to board" id="boardRead" />
					<CustomCheckbox field={model.canWriteBoard} onFieldChange={model.canWriteBoard.set} label="Can Write Board" id="canWriteBoard" />
					<CustomCheckbox field={model.canСhangeBoard} onFieldChange={model.canСhangeBoard.set} label="Can Сhange Board" id="canСhangeBoard" />
					<CustomCheckbox field={model.canWriteAccess} onFieldChange={model.canWriteAccess.set} label="Change user access" id="canWriteAccess" />
					<CustomCheckbox field={model.canReadBacklog} onFieldChange={model.canReadBacklog.set} label="can Read Backlog" id="canReadBacklog" />
					<CustomCheckbox field={model.canСhangeBacklog} onFieldChange={model.canСhangeBacklog.set} label="Can Сhange Backlog" id="CanСhangeBacklog" />
				</div>
				<div className="col">
					<CustomCheckbox field={model.canWriteComment} onFieldChange={model.canWriteComment.set} label="Leave Comment" id="commentWrite" />
					<CustomCheckbox field={model.canWriteAllTasks} onFieldChange={model.canWriteAllTasks.set} label="All Task Write" id="allTaskWrite" />
					<CustomCheckbox field={model.canWriteTask} onFieldChange={model.canWriteTask.set} label="Task Write" id="taskWrite" />
					<CustomCheckbox field={model.canCloseTask} onFieldChange={model.canCloseTask.set} label="Task Close" id="CanCloseTask" />
					<CustomCheckbox field={model.canAcceptTask} onFieldChange={model.canAcceptTask.set} label="Task Accept" id="canTaskAccept" />
					{allowTesting}
				</div>
			</div>
			<hr />
			<div className="text-right">
				<span  onClick={props.onClose} className="btn btn-secondary float-left">Cancel</span>
				<button type="submit" className="btn btn-primary">Submit</button>
				
			</div>
		</form>
		);
	}
}