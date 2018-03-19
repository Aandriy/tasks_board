import React, { Component } from 'react';
import { form } from '../../utility';
import { InputFormGroup, ValidationSummary, Loading } from '../ui';
import AuthService from '../../services/auth.service';
import PropTypes from 'prop-types';
class ProfileFormModel {
	constructor(params = {}) {
		this.fullName = "";
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

export default class ProfileForm extends Component {
	static propTypes = {
		model: PropTypes.object.isRequired,
		onCancel: PropTypes.func.isRequired,
		onSubmit: PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);

		const state = {
			loading: false
		};

		form.mount(new ProfileFormModel(this.props.model), state, this);
		const validationModel = state.model;
		validationModel.fullName.push('required');
		this.state = state;

		['onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	};
	submit(query) {
		AuthService.setUserData(query).done((response) => {
			this.setState({ loading: false });
			this.response(response).done(() => {
				this.props.onSubmit();
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
			<form onSubmit={this.onSubmit} >
				{loading}
				<ValidationSummary summary={state.validationSummary} />
				<InputFormGroup field={model.fullName} onFieldChange={model.fullName.set} label="Full Name" id="fullName" />
				<div className="form-group">
					<button type="submit" className="btn btn-default float-right">Submit</button>
					<span className="btn btn-secondary" onClick={this.props.onCancel}>Cancel</span>
				</div>
			</form>
		);
	}
}