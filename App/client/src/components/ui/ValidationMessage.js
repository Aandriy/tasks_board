import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ValidationMessage extends Component {
	static propTypes = {
		field: PropTypes.func.isRequired
	};
	render() {
		const observableField = this.props.field;
		if (observableField.isModifiedAndInvalid) {
			const msg = observableField.errors.join("\r\n");
			return (<span className="invalid-feedback d-block">{msg}</span>);
		}
		return null;
	}
}
