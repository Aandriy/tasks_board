import React, { Component } from 'react';
import { form } from '../../utility';
import PropTypes from 'prop-types';
import { InputFormGroup, CustomCheckbox } from '../ui';
import BoardService from '../../services/board.service';

class BoardForm extends Component {
	static propTypes = {
		model: PropTypes.object.isRequired,
		performSubmit: PropTypes.func.isRequired,
		onDone: PropTypes.func.isRequired
	};
	static modele = {};
	constructor(props) {
		super(props);
		const model = props.model;
		const state = {};

		this.model = model;
		form.mount(model, state, this);
		const validationModel = state.model;

		validationModel.title.validators.push('required');
		validationModel.priority.validators.push('required');
		validationModel.description.validators.push('required');
		validationModel.title.validators.push('isEMail');

		validationModel.title.check();
		validationModel.priority.check();
		validationModel.description.check();

		this.state = state;

		['onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	};

	componentWillMount() {
		this.props.performSubmit.callback = this.onSubmit;
	};

	submit(query) {
		BoardService.createBoard(query).done((response) => {
			this.response(response).done(() => {
				if (response.id) {
					const id = response.id;
					this.props.onDone(id);
				}
			});
		});
	}

	rewriteField(fieldName, val) {
		const state = this.state;
		const newState = {
			validationSummary: ''
		};
		state[fieldName](val);
		newState[fieldName] = state[fieldName];
		this.setState(state);
	}
	onSubmit(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		}
		if (this.isValid()) {
			const query = this.getQuery();
			this.submit(query);
		}
	}
	render() {
		const state = this.state;
		const model = state.model;
		return (
			<form onSubmit={this.onSubmit}>
				<InputFormGroup field={model.title} onFieldChange={model.title.set} label="Title" id="Title" />
				<InputFormGroup field={model.priority} onFieldChange={model.priority.set} label="Priority" id="Priority" inputAttr={{ maxLength: 9 }} />
				<InputFormGroup field={model.description} onFieldChange={model.description.set} label="Description" id="Description" type="textarea" />
				<CustomCheckbox field={model.publish} onFieldChange={model.publish.set} label="Publish" id="Publish" />
				<CustomCheckbox field={model.allowTesting} onFieldChange={model.allowTesting.set} label="Just Testing Option" id="allowTesting" />
			</form>
		);
	}
}

export default BoardForm;