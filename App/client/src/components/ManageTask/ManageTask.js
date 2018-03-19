import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ManageTaskPopup from './ManageTaskPopup';

export default class ManageTask extends Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		onDone: PropTypes.func.isRequired,
		title: PropTypes.string.isRequired,
		getModel: PropTypes.string.isRequired,
		className: PropTypes.string
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
		this.props.onDone();
	};
	render() {
		const state = this.state;
		const props = this.props;
		const popup = state.show ? <ManageTaskPopup show={state.show} close={this.hidePopup} data={props.data} title={props.title} getModel={props.getModel} /> : null;

		return (
			<div className={props.className}>
				<div onClick={this.showPopup}>{props.children}</div>
				{popup}
			</div>
		);
	};
}