import React, { Component } from 'react';
import PhonesList from './phonesList';

class Home extends Component {
	render() {
		//const url = 'http://localhost:60190/api/values';
		const url = '/api/values';
		return (<div>
			<h1>Home</h1>
			<PhonesList apiUrl={url} />
		</div>);
  }
}

export default Home;