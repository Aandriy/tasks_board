import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Register, Login, Logout, ForgotPassword, ForgotPasswordConfirmation, ResetPassword, ResetPasswordConfirmation, EmailConfirmation } from '../components/auth';
import Header from '../components/shared/header';
import NotFound from '../components/NotFound';

export default class Unauthorized extends Component {
	render() {
		return (
			<div className="d-table-row-group">
				<Header />
				<Switch>
					<Redirect exact path='/' to="/Login" />
					<Route path='/Register' component={Register} />
					<Route path='/Login' component={Login} />
					<Route path='/Logout' component={Logout} />
					<Route path='/ForgotPassword' component={ForgotPassword} />
					<Route path='/ForgotPasswordConfirmation' component={ForgotPasswordConfirmation} />
					<Route path='/ResetPassword' component={ResetPassword} />
					<Route path='/ResetPasswordConfirmation' component={ResetPasswordConfirmation} />
					<Route path='/EmailConfirmation' component={EmailConfirmation} />
					<Route component={NotFound} />
				</Switch>
			</div>
		);
	}
}

