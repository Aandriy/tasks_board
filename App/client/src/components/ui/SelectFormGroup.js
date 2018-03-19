import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ValidationMessage from './ValidationMessage';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class SelectFormGroup extends Component {
	static propTypes = {
		field: PropTypes.func.isRequired,
		onFieldChange: PropTypes.func.isRequired,
		label: PropTypes.string.isRequired,
		options: PropTypes.array.isRequired,
		id: PropTypes.string
	};
	static defaultProps = {
		type: 'text',
		inputAttr: {}
	};
	render() {
		const props = this.props;
		const field = props.field;
		const labelAttr = {};
		const selectAttr = {};

		Object.assign(selectAttr, props.selectAttr);
		selectAttr.className = classNames({ 'is-invalid': field.isModifiedAndInvalid });
		selectAttr.value = field();
		selectAttr.options = props.options;
		selectAttr.onChange = (val) => {
			if (val && val.value) {
				val = val.value
			}
			props.onFieldChange(val);
		};
		const isRequired = () => {
			if (field.isRequired) {
				return (<span className="required">*</span>)
			}
			return null;
		};
		return (<div className="form-group">
			<label {...labelAttr}>{props.label}{isRequired()}</label><br />
			<Select
				{...selectAttr}
			/>
			<ValidationMessage field={field} />
		</div>)
	}
}
