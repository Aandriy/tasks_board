import React, { Component } from 'react';
import { form } from '../../utility';
import { Redirect } from 'react-router'
import { InputFormGroup, ValidationSummary, Loading } from '../ui';
import AuthService from '../../services/auth.service';
import PropTypes from 'prop-types';
class ResetPasswordModel {
	constructor(params = {}) {
		this.email = "";
		this.password = "";
		this.confirmPassword = "";
		this.code = "";
		Object.keys(this).forEach((key) => {
			let val = params[key];
			if (typeof (val) !== 'undefined') {
				if (val === null) {
					val = '';
				}
				this[key] = val;
			}
		});
	}
}

export default class ResetPasswordForm extends Component {
	static propTypes = {
		model: PropTypes.object.isRequired
	};
	constructor(props) {
		super(props);
		const model = new ResetPasswordModel(this.props.model);
		const state = {
			loading: false
		};
		this.model = model;
		form.mount(model, state, this);
		const validationModel = state.model;

		validationModel.code.push('required');
		validationModel.email.push('required', 'email');
		validationModel.password.push('required');
		validationModel.confirmPassword.push('required');


		this.state = state;

		['onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	}

	onSubmit(e) {
		e.preventDefault();
		const query = this.getQuery();
		this.setState({ loading: true });
		AuthService.resetPassword(query).done((response) => {
			this.setState({ loading: false });
			this.response(response);
		});
	}
	render() {
		const state = this.state;
		const model = state.model;
		if (model.code.isInvalid) {
			if (!model.code()) {
				return (<div><p>A code must be supplied for password reset.</p></div>);
			}
			return (<Redirect to="/ResetPasswordConfirmation" />);
		}
		const loading = state.loading ? (<Loading locked={true} />) : null;
		return (
			<form onSubmit={this.onSubmit} className="jumbotron">
				<h2 className="display-4">Reset Password</h2>
				{loading}
				<ValidationSummary summary={state.validationSummary} />
				<InputFormGroup field={model.email} onFieldChange={model.email.set} label="Email" id="Email" />
				<InputFormGroup field={model.password} onFieldChange={model.password.set} label="Password" id="Password" type="password" />
				<InputFormGroup field={model.confirmPassword} onFieldChange={model.confirmPassword.set} label="Password Confirm" id="confirmPassword" type="password" />
				<div className="form-group">
					<button type="submit" className="btn btn-default">Submit</button>
				</div>
			</form>

		);
	}
}