import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ResetPasswordForm from './ResetPasswordForm';
import queryString from 'query-string';

export default class ResetPassword extends Component {
	constructor(props) {
		super(props);
		const state = {};
		const parsed = queryString.parse(window.location.search);
		state.model = {
			code: parsed.code
		};
		this.state = state;
	}

	render() {
		const state = this.state;
		const model = state.model;

		return (
			<div className="d-table-row ">
				<div className="container-fluid py-md-3">
					<div className="row justify-content-md-center">
						<div className="col-md-8">
							<ResetPasswordForm model={model} />
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