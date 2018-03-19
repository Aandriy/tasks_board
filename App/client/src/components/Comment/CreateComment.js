import React, { Component } from 'react';
import CommentForm from './CommentForm';
import EditCommentModel from './EditComment.model';
import PropTypes from 'prop-types';

export default class CreateComment extends Component {
	static propTypes = {
		id: PropTypes.number.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			data: null
		}
	};
	
	render() {
		const model = new EditCommentModel({goalId: this.props.id});
		return (<div>
			<h2 className="display-4">Leave a Comment</h2>
			<CommentForm model={model} onManage={this.props.onManage} />
		</div>);
	};
}