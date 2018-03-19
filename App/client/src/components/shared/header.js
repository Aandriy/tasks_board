import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
	render() {
		const user = this.props.user;
		const isAuthorized = !!user.name;
		const currentUser = () => {
			if (user.name) {
				return (<div>{user.name} <Link className="navbar-brand" to="/Logout">Logout</Link></div>);
			}
			return <Link className="navbar-brand" to="/Login">Login</Link>;
		}
		
		const menu = () => {
			if (isAuthorized) {
				return (
					<ul className="nav">
						<li className="nav-item">
							<Link className="nav-link" to="/">Home</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/Profile">Profile</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/About">About</Link>
						</li>
					</ul>
				);
			}
			return (
				<ul className="nav">
					<li className="nav-item">
						<Link className="nav-link" to="/">Home</Link>
					</li>
				</ul>
			);
		};

		return (
			<div className="d-table-row">
				<header className="d-table-cell App-header h-1">
					<nav className="menubar">
						<div className="float-right">{currentUser()}</div>
						{menu()}
					</nav>
				</header>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Header);