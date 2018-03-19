import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { form } from '../../utility';
import { InputFormGroup, ValidationSummary } from '../ui';
import UserService from '../../services/user.service';
class RegisterUserModel {
	constructor(params = {}) {
		this.email = "";
		this.fullName = "";
		this.password = "";
		this.passwordConfirm = "";
	}
}


class Register extends Component {

	constructor(props) {
		super(props);
		const model = new RegisterUserModel();
		const state = {};
		this.model = model;
		form.mount(model, state, this);
		const validationModel = state.model;
		
		validationModel.email.validators.push('required', 'email');
		validationModel.fullName.validators.push('required');
		validationModel.password.validators.push('required');
		validationModel.passwordConfirm.validators.push('required');

		validationModel.email.check();
		validationModel.password.check();
		validationModel.passwordConfirm.check();
		validationModel.fullName.check();
		this.state = state;

		['onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	}


	rewriteField(fieldName, val) {
		const state = this.state;
		const newState = {
			validationSummary: []
		};
		state[fieldName](val);
		newState[fieldName] = state[fieldName];
		state.validationSummary = [];
		this.setState(state);
	};

	onSubmit(e) {
		e.preventDefault();
		const query = this.getQuery();
		
	

		UserService.registerNewUser(query).done((response) => {
			this.response(response).done(() => {
				if (response.isAuthenticated) {
					const url = response.redirect || '/Login';
					this.props.history.push(url);
				}
			});
		});
	}
	render() {
		const state = this.state;
		const model = state.model;
		return (
			<div className="d-table-row ">
				<div className="container">
					<div className="row justify-content-md-center">
						<div className="col-md-8">
							<h2>Register</h2>
							<ValidationSummary summary={state.validationSummary} />
							<form onSubmit={this.onSubmit}>
								<InputFormGroup field={model.email} onFieldChange={model.email.set} label="Email" id="Email" />
								<InputFormGroup field={model.fullName} onFieldChange={model.fullName.set} label="Full Name" id="FullName" />
								<InputFormGroup field={model.password} onFieldChange={model.password.set} label="Password" id="Password" type="password" />
								<InputFormGroup field={model.passwordConfirm} onFieldChange={model.passwordConfirm.set} label="Password Confirm" id="passwordConfirm" type="password" />

								<div className="form-group">
									<button type="submit" className="btn btn-default">Submit</button>
								</div>
							</form>
							<div className="container">
								<p>Already have an account? <Link to="/Login">login here</Link></p>
								<p>Forgot your password? <Link to="/ForgotPassword">click here</Link></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Register;