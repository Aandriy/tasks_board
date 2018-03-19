import React, { Component } from 'react';
import ViewBoardPopup from './ViewBoardPopup';
import PropTypes from 'prop-types';

export default class ViewBoard extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		onCloce: PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			show: false
		}
		this.hidePopup = this.hidePopup.bind(this);
		this.showPopup = this.showPopup.bind(this);

	};
	showPopup() {
		this.setState({
			show: true
		});
	};
	hidePopup() {
		this.setState({
			show: false
		});
		this.props.onCloce();
	};
	render() {
		const state = this.state;
		const props = this.props;
		const popup = state.show ? <ViewBoardPopup show={state.show} onClose={this.hidePopup} data={props.data} /> : null;

		return (
			<div>
				<div onClick={this.showPopup}>{props.children}</div>
				{popup}
			</div>
		);
	};
}

