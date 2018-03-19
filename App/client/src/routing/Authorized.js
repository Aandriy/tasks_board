import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Register, Login, Logout, ForgotPassword, ForgotPasswordConfirmation, ResetPassword, ResetPasswordConfirmation, EmailConfirmation } from '../components/auth';
import Home from '../components/Home/Home';
import Header from '../components/shared/header';
import NotFound from '../components/NotFound';

import About from '../components/About';

import Board from '../components/Board/Board';
import PrioritizeBacklog from '../components/Backlog/PrioritizeBacklog';
import ArchiveBoard from '../components/Board/ArchiveBoard';

import ViewBoard from '../components/ManageBoard/ViewBoard';
import Profile from '../components/Profile/Profile';


export default class Authorized extends Component {
	render() {
		return (
			<div className="d-table-row-group">
				<Header />
				<Switch>
					<Route exact path='/' component={Home} />
					<Route path='/About' component={About} />
					<Route path='/Register' component={Register} />
					<Route path='/Login' component={Login} />
					<Route path='/Logout' component={Logout} />
					<Route path='/ForgotPassword' component={ForgotPassword} />
					<Route path='/ForgotPasswordConfirmation' component={ForgotPasswordConfirmation} />
					<Route path='/ResetPassword' component={ResetPassword} />
					<Route path='/ResetPasswordConfirmation' component={ResetPasswordConfirmation} />
					<Route path='/EmailConfirmation' component={EmailConfirmation} />


					<Route path='/ViewBoard/:id' component={ViewBoard} />
					<Route path='/Board/:id' component={Board} />
					<Route path='/Backlog/:id' component={PrioritizeBacklog} />
					<Route path='/Archive/:id' component={ArchiveBoard} />
					<Route path='/Profile' component={Profile} />
					<Route component={NotFound} />
				</Switch>
			</div>);
	}
}

