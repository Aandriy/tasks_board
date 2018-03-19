import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ResetPasswordConfirmation extends Component {
	render() {
		return (<div>
			<h1>Reset password confirmation</h1>
			<p>Your password has been reset. Please <Link to="/Login">click here to log in</Link>.</p>
		</div>);
	}
}

export default ResetPasswordConfirmation;