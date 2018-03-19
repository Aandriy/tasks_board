import React, { Component } from 'react';
import { form } from '../../utility';
import PropTypes from 'prop-types';
import { WysiwygFormGroup } from '../ui';
import CommentService from '../../services/comment.service';

export default class CommentForm extends Component {
	static propTypes = {
		model: PropTypes.object.isRequired,
		onManage: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		const model = props.model;

		const state = {};
		form.mount(model, state, this);
		const validationModel = state.model;

		validationModel.body.validators.push('required');
		validationModel.body.check();

		this.state = state;

		['onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	}

	submit(query) {
		CommentService.createComment(query).done((response) => {
			this.response(response).done(() => {
				console.log(response)
				this.resetForm();
				this.props.onManage();
			});
		});
	}
	onSubmit(e) {
		e.preventDefault();
		if (this.isValid()) {
			const query = this.getQuery();
			this.resetForm();
			this.submit(query);
		}
	}
	render() {
		const state = this.state;
		const model = state.model;
		return (<form onSubmit={this.onSubmit} className="jumbotron">
			<WysiwygFormGroup field={model.body} onFieldChange={model.body.set} label="Comment" id="Comment" />
			<div>
				<div className="form-group float-right">
					<button type="submit" className="btn btn-default">Submit</button>
				</div>
			</div>
		</form>);
	}
}