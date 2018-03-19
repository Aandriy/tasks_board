import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ajax, form } from '../../utility';
import { InputFormGroup, ValidationSummary } from '../ui';


class ForgotPassword extends Component {

	constructor(props) {
		super(props);
		const model = {
			email: ''
		};
		const state = {};
		form.mount(model, state, this);
		const validationModel = state.model;
		validationModel.email.validators.push('required', 'email');
		validationModel.email.check();
		this.state = state;

		['onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	};
	submit(query){
		const url = '/api/Auth/Account/ForgotPassword/';
		ajax.submit({
			url: url,
			data: query
		}).done(function (data) {
			if (!data) {

			} else {
				if (data.isAuthenticated) {
					window.location.href = '/Login';
				}
			}
		});
	}
	onSubmit(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		if (this.isValid()) {
			const query = this.getQuery();
			this.submit(query);
		}
	};

	render() {
		const state = this.state;
		const model = state.model;
		return (
			<div className="d-table-row ">
				<div className="container">
					<div className="row justify-content-md-center">
						<div className="col-md-8">
							<h2>Forgot Password</h2>
							<ValidationSummary summary={state.validationSummary} />
							<form onSubmit={this.onSubmit}>
								<InputFormGroup field={model.email} onFieldChange={model.email.set} label="Email" id="Email" />
								<div className="form-group">
									<button type="submit" className="btn btn-default">Submit</button>
								</div>
							</form>
							<div className="container">
								<p>Already have an account? <Link to="/Login">login here</Link></p>
								<p>New User? <Link to="/Register">Create new Account</Link></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ForgotPassword;