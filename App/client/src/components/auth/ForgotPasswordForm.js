import React, { Component } from 'react';
import { form } from '../../utility';
import { InputFormGroup, ValidationSummary, Loading } from '../ui';
import AuthService from '../../services/auth.service';
import PropTypes from 'prop-types';
class ForgotPasswordModel {
	constructor(params = {}) {
		this.email = "";
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

export default class ForgotPasswordForm extends Component {
	static propTypes = {
		model: PropTypes.object.isRequired
	};
	constructor(props) {
		super(props);

		const state = {
			loading: false
		};
		form.mount(new ForgotPasswordModel(this.props.model), state, this);
		const validationModel = state.model;
		validationModel.email.push('required', 'email');
		this.state = state;

		['onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	};
	submit(query) {
		AuthService.forgotPassword(query).done((response) => {
			this.setState({ loading: false });
			this.response(response).done(() => {
				console.log(response);
			});
		});
	}
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

	render() {
		const state = this.state;
		const model = state.model;
		const loading = state.loading ? (<Loading locked={true} />) : null;
		return (
			<form onSubmit={this.onSubmit} className="jumbotron">
				<h2 className="display-4">Forgot Password</h2>
				{loading}
				<ValidationSummary summary={state.validationSummary} />
				<InputFormGroup field={model.email} onFieldChange={model.email.set} label="Email" id="Email" />
				<div className="form-group">
					<button type="submit" className="btn btn-default">Submit</button>
				</div>
			</form>
		);
	}
}