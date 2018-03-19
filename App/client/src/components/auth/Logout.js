import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { userSetAction } from '../../actions/userSetAction';
import UserService from '../../services/user.service';

class Logout extends Component {
	render() {
		UserService.logOff().done((response) => {
			this.props.userSetAction({});
		});

		return (<div></div>);
	}
}
function matchDispatchToProps(dispatch) {
	return bindActionCreators({ userSetAction: userSetAction }, dispatch);
}

export default connect(null, matchDispatchToProps)(Logout);