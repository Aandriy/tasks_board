import React, { Component } from 'react';
import { form } from '../../utility';
import PropTypes from 'prop-types';
import { InputFormGroup,ValidationSummary  } from '../ui';
import UserService from '../../services/user.service';

export default class UserInviteForm extends Component {
	static propTypes = {
		model: PropTypes.object.isRequired,
		onManage: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		const model = props.model;

		const state = {};
		form.mount(model, state, this);
		const validationModel = state.model;

		validationModel.email.validators.push('required','email');
		validationModel.email.check();

		this.state = state;

		['onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	};

	submit(query) {
		UserService.userInvite(query).done((response) => {
			this.response(response).done(() => {
				this.resetForm();
				this.props.onManage();
			});
		});
	}
	onSubmit(e) {
		e.preventDefault();
		const query = this.getQuery();
		this.submit(query);
	}
	render() {
		const state = this.state;
		const model = state.model;
		return (<form onSubmit={this.onSubmit} className="jumbotron">
			<ValidationSummary summary={state.validationSummary} />
			<InputFormGroup field={model.email} onFieldChange={model.email.set} label="Email" id="email" />
			<div>
				<div className="form-group float-right">
					<button type="submit" className="btn btn-default">Submit</button>
				</div>
			</div>
		</form>);
	}
}