import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CreateComment from '../Comment/CreateComment';
import CommentList from '../Comment/CommentList';
import CommentService from '../../services/comment.service';
import { Loading, Pagination } from '../ui';


export default class Comment extends Component {
	static propTypes = {
		edit: PropTypes.bool.isRequired,
		id: PropTypes.number.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			comments: [],
			page: 1,
			total: 1,
			isLoading: true
		}
		this.onManageComment = this.onManageComment.bind(this);
		this.changePage = this.changePage.bind(this);
	};
	componentDidMount() {
		this.getData();
	};

	getData(page) {
		if (!page) {
			page = this.state.page;
		}
		const query = {
			id: this.props.id,
			page: page
		};

		CommentService.getComments(query).done((response) => {
			const newState = {
				isLoading: false,
				comments: response.items || [],
				first: response.first,
				page: response.page || 1,
				total: response.totalPages || 1
			};
			this.setState(newState);
		});
	};

	changePage(page) {
		this.getData(page);
	};
	onManageComment() {
		this.getData();
	};

	render() {
		const state = this.state;
		const props = this.props;
		const edit = props.edit;
		const id = props.id;
		const comments = state.comments;
		const form = () => {
			if (!edit) {
				return null;
			}
			return (<CreateComment id={id} onManage={this.onManageComment} />);
		};

		const commentsBox = () => {
			if (state.isLoading) {
				return (<Loading />)
			}
			return (<div>
				<CommentList items={comments} start={state.first} />
				<Pagination current={state.page} total={state.total} callback={this.changePage} />
			</div>)
		};

		return (<section>
			<h2 className="display-4">Comments</h2>
			{commentsBox()}
			<hr />
			{form()}
		</section>)
	};
}