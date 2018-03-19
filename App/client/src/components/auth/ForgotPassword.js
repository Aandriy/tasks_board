import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';

class ForgotPassword extends Component {
	constructor(props) {
		super(props);
		const state = {};
		this.state = state;
	};
	render() {
		return (
			<div className="d-table-row ">
				<div className="container-fluid py-md-3">
					<div className="row justify-content-md-center">
						<div className="col-md-8">
							<ForgotPasswordForm model={{}} />
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