import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
export default class Loading extends Component {
	static propTypes = {
		locked:PropTypes.bool
	}
	render() {
		if (this.props.locked){
			return ([ReactDOM.createPortal(<div className="loading-fixed"><i className="icon icon-spinner6"></i></div>, document.body)]);
		}
		return (<div className="loading">Loading...</div>)
	}
}
