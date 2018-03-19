import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ValidationMessage from './ValidationMessage';
import moment from 'moment';
import DatePicker from 'react-datepicker';

export default class DatepickerFormGroup extends Component {
	static propTypes = {
		field: PropTypes.func.isRequired,
		onFieldChange: PropTypes.func.isRequired,
		label: PropTypes.string.isRequired,
		type: PropTypes.string,
		id: PropTypes.string,
		inputAttr: PropTypes.object
	};
	static defaultProps = {
		type: 'text',
		inputAttr: {}
	};
	render() {
		const props = this.props;
		const field = props.field;
		const labelAttr = {};
		const inputAttr = {};

		Object.assign(inputAttr, props.inputAttr);
		inputAttr.className = classNames('form-control', { 'is-invalid': field.isModifiedAndInvalid });
		
		if (field()) {
			inputAttr.selected = moment(field());
		}
		inputAttr.onChange = (val) => {
			if (val) {
				val = moment(val).format()
			}
			props.onFieldChange(val)
		};
		if (props.id) {
			inputAttr.id = props.id;
			labelAttr.htmlFor = props.id;
		}

		const isRequired = () => {
			if (field.isRequired) {
				return (<span className="required">*</span>)
			}
			return null;
		};
		return (<div className="form-group">
			<label {...labelAttr}>{props.label}{isRequired()}</label><br />
			<DatePicker
				{...inputAttr}
			/>
			<ValidationMessage field={field} />
		</div>)
	}
}
