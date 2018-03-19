import React, { Component } from 'react';
import { connect } from 'react-redux';
import BoardList from './boardList';

class Home extends Component {
	
	render() {
		const user = this.props.user;
		if (user && user.name) {
			return (<BoardList />);
		}
		return (<div>
			<h1>Home</h1>
			
		</div>);
  }
}

function mapStateToProps(state) {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Home);

