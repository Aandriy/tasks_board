import React, { Component } from 'react';
import store from './store/store';
import UserService from './services/user.service';
import { Loading } from './components/ui';

import Unauthorized from './routing/Unauthorized';
import Authorized from './routing/Authorized';



class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isUserChecked: false
		}
	}
	componentWillMount() {
		UserService.getCurrentUser().done((response) => {
			this.setState({ isUserChecked: true });
		});
	}
	render() {
		const user = store.getState().user || {};
		if (!this.state.isUserChecked) {
			return (<div><Loading /></div>);
		}
		if (!user.isAuthorized) {
			return (<Unauthorized />);
		}
		return (<Authorized />);
	}
}

export default App;
