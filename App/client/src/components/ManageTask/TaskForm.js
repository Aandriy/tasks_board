import React, { Component } from 'react';
import { form, biDirectionalDictionary, pipes } from '../../utility';
import PropTypes from 'prop-types';
import { InputFormGroup, SelectFormGroup, DatepickerFormGroup, CustomCheckbox, WysiwygFormGroup } from '../ui';
import TaskService from '../../services/task.service';


export default class TaskForm extends Component {
	static propTypes = {
		model: PropTypes.object.isRequired,
		users: PropTypes.array.isRequired,
		settings: PropTypes.array.isRequired,
		statuses: PropTypes.array.isRequired,
		performSubmit: PropTypes.func
	};

	constructor(props) {
		super(props);
		const model = props.model;
		const state = {};

		form.mount(model, state, this);

		const validationModel = state.model;

		validationModel.ownerId.validators.push('required');
		validationModel.title.validators.push('required');
		validationModel.purpose.validators.push({ name: 'required', isHtml: true });
		validationModel.acceptanceCriteria.validators.push({ name: 'required', isHtml: true });
		validationModel.setting.validators.push('required');

		validationModel.ownerId.check();
		validationModel.title.check();
		validationModel.purpose.check();
		validationModel.acceptanceCriteria.check();

		this.state = state;

		['onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	}
	componentWillMount() {
		this.props.performSubmit.callback = this.onSubmit;
	};
	submit(query) {
		TaskService.createTask(query).done((response) => {
			this.response(response).done(() => {
				if (response.id) {
					const id = response.id;
					this.props.onDone(id);
				}
			});
		});
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
		const props = this.props;
		const model = state.model;
		const statuses = biDirectionalDictionary(props.statuses);
		let isDisableStatus = false;
		const settings = props.settings.map((item) => {
			return {
				label: pipes.unCaseString(item.label),
				value: item.value
			}
		});
		if (typeof (model.status()) === "number") {
			isDisableStatus = !statuses[model.status()];
		}
		const close = () => {
			if (props.allowClose) {
				return (<CustomCheckbox field={model.closed} onFieldChange={model.closed.set} label="Close" id="Closed" />);
			}
			return null;
		};
		const status = (isDisableStatus) ? null : (<SelectFormGroup field={model.status} onFieldChange={model.status.set} label="Status" id="Status" options={this.props.statuses} />);
		return (
			<form onSubmit={this.onSubmit} >
				<InputFormGroup field={model.title} onFieldChange={model.title.set} label="Title" id="Title" />
				<WysiwygFormGroup field={model.purpose} onFieldChange={model.purpose.set} label="Goal" id="Purpose" />
				<WysiwygFormGroup field={model.acceptanceCriteria} onFieldChange={model.acceptanceCriteria.set} label="Acceptance Criteria" id="acceptanceCriteria" />
				<WysiwygFormGroup field={model.details} onFieldChange={model.details.set} label="Details" id="Details" />
				<SelectFormGroup field={model.ownerId} onFieldChange={model.ownerId.set} label="Owner" id="OwnerId" options={props.users} />
				<DatepickerFormGroup field={model.timeBound} onFieldChange={model.timeBound.set} label="Time Bound" id="TimeBound" />
				{status}
				<SelectFormGroup field={model.setting} onFieldChange={model.setting.set} label="Importance" id="Setting" options={settings} />
				{close()}
			</form>
		);
	}
}