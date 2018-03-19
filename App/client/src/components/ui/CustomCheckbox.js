import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class CustomCheckbox extends Component {
	static propTypes = {
		field: PropTypes.func.isRequired,
		onFieldChange: PropTypes.func.isRequired,
		label: PropTypes.string,
		name: PropTypes.string,
		id: PropTypes.string,
		onLabel: PropTypes.string,
		offLabel: PropTypes.string
	};
	static defaultProps = {
		onLabel: 'On',
		offLabel: 'Off'
	};
	render() {
		const props = this.props;
		const inputAttr = {
			className: classNames('custom-control-input', { 'is-invalid': props.field.isModifiedAndInvalid }),
			checked: props.field(),
			onChange: () => {
				props.onFieldChange(!props.field())
			}
		};
		const labelAttr = {};
		if (props.id) {
			inputAttr.id = props.id;
			labelAttr.htmlFor = props.id;
		}
		if (props.name) {
			inputAttr.name = props.name;
		}
		const checkbox = (
			<label className="input-switch">
				<input {...inputAttr} type="checkbox" />
				<div className="input-switch-group">
					<span className="btn btn-success input-switch-on">{props.onLabel}</span>
					<span className="btn btn-secondary input-switch-off">{props.offLabel}</span>
					<span className="input-switch-handle btn btn-danger"></span></div>
			</label>
		);

		if (!props.label) {
			return checkbox;
		}
		return (
			<div className="input-switch-container">
				{checkbox}
				<label {...labelAttr} className="input-switch-label"> {props.label}</label>
			</div>
		);
	}
}
