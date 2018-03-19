import React from 'react';
import { shallow } from 'enzyme';
import InputFormGroup from './InputFormGroup';
import validation from '../../utility/validation';
import ValidationMessage from './ValidationMessage';

// setup file
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });


test('[InputFormGroup] label', () => {
	// Render a checkbox with label in the document
	const model = {
		email: validation.observable('example')
	};
	const onFieldChange = () => { };
	const checkbox = shallow(<InputFormGroup field={model.email} onFieldChange={onFieldChange} label="Email" id="Email" />);

	expect(checkbox.find('label').text()).toEqual('Email');
	expect(checkbox.find('input').render().val()).toEqual('example');
});