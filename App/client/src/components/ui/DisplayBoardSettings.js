import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { form } from '../../utility';
import { CustomCheckbox } from '../ui';

export default class DisplayBoardSettings extends Component {
	static propTypes = {
		onChange: PropTypes.func.isRequired,
		onlyEditableSection: PropTypes.bool,
		onlyMineTasks: PropTypes.bool,
		data: PropTypes.object.isRequired,
		refreshBoard:PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);
		const model = {
			onlyEditableSection: this.props.onlyEditableSection,
			onlyMineTasks: this.props.onlyMineTasks
		};

		const state = {
			isOpen: false
		};
		form.mount(model, state, this);
		this.state = state;

		['onSubmit', 'toggleSsettingBox'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	};
	onSubmit() {
		const query = this.getQuery();
		this.props.onChange(query);
	};
	toggleSsettingBox() {
		this.setState({ isOpen: !this.state.isOpen });
	};
	onChange(name) {
		const model = this.state.model;
		return (val) => {
			model[name].set(val);
			this.onSubmit();
		}
	};
	render() {
		const state = this.state;
		const model = state.model;
		const drop = (() => {
			return (
				<div className="dropdown-menu">
					<label className="dropdown-item">
						Show Only Editable Section
						<CustomCheckbox field={model.onlyEditableSection} onFieldChange={this.onChange('onlyEditableSection')} onLabel="Yes" offLabel="No" />
					</label>
					<label className="dropdown-item">
						Show Only Mine Tasks
						<CustomCheckbox field={model.onlyMineTasks} onFieldChange={this.onChange('onlyMineTasks')} onLabel="Yes" offLabel="No" />
					</label>
				</div>
			)
		})();

		return (
			<div className="float-left dropdown checkbox-dropdown">
				<span className="btn btn-outline-secondary" onClick={this.toggleSsettingBox} >
					<i className="icon-cog" ></i>
				</span>
				{drop}
			</div>
		);
	};
}
