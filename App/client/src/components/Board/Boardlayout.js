import React, { Component } from 'react';


export default class Boardlayout extends Component {
	render() {
		return (
			<div className="d-table-row ">
				<div className="container-box">
					{this.props.children}
				</div>
			</div>
		);
	}
}