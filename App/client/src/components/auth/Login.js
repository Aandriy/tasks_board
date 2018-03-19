import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { form } from '../../utility';
import UserService from '../../services/user.service';
import { userSetAction } from '../../actions/userSetAction';

import { InputFormGroup, ValidationSummary, CustomCheckbox, Loading } from '../ui';

class LoginModel {
	constructor(params = {}) {
		this.email = "";
		this.password = "";
		this.rememberMe = false;
		this.returnUrl = "";
	}
}

class Login extends Component {
	constructor(props) {
		super(props);
		const model = new LoginModel();
		this.model = model;
		const state = {
			loading: false
		};
		this.model = model;
		form.mount(model, state, this);
		const validationModel = state.model;

		validationModel.password.push('required');
		validationModel.email.push('required', 'email');

		this.state = state;

		['onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	};

	canBeSubmitted() {
		const state = this.state;
		const isDisabled = state.email.isInvalid || state.password.isInvalid;
		return !isDisabled;
	};

	onSubmit(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		if (this.isValid()) {
			this.setState({ loading: true });
			const query = this.getQuery();
			this.submit(query);
		}
	};

	submit(query) {
		UserService.login(query).done((response) => {
			this.setState({ loading: false });
			this.response(response).done(() => {
				UserService.getCurrentUser().done((data) => {
					if (data.user) {
						this.props.history.push('/');
					}
				});
			});
		});
	};

	render() {
		const state = this.state;
		const model = state.model;
		const isDisabled = model.email.isInvalid || model.password.isInvalid;
		const loading = state.loading ? (<Loading locked={true} />) : null;

		return (
			<div className="d-table-row ">
				<div className="container-fluid py-md-3">
					<div className="row justify-content-md-center">
						<div className="col-md-8">
							<form onSubmit={this.onSubmit} className="jumbotron">
								<h1 className="display-4">Login</h1>
								{loading}
								<ValidationSummary summary={state.validationSummary} />
								<InputFormGroup field={model.email} onFieldChange={model.email.set} label="Email" id="Email" />
								<InputFormGroup field={model.password} onFieldChange={model.password.set} label="Password" id="Password" type="password" />
								<div className="row">
									<div className="col-sm">
										<CustomCheckbox field={model.rememberMe} onFieldChange={model.rememberMe.set} label="Remember Me" id="rememberMe" />
									</div>
									<div className="col-sm text-right">
										<button disabled={isDisabled} type="submit" className="btn btn-default">Submit</button>
									</div>
								</div>
							</form>
							<div className="container">
								<p>Forgot your password? <Link to="/ForgotPassword">click here</Link></p>
								<p>New User? <Link to="/Register">Create new Account</Link></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({ userSetAction: userSetAction }, dispatch);
}

export default connect(null, matchDispatchToProps)(Login);