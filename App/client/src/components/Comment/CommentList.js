import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Avatar } from '../ui';
import renderHTML from 'react-render-html';

export default class CommentList extends Component {
	static propTypes = {
		items: PropTypes.array.isRequired,
		start: PropTypes.number.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			data: null
		}
	};

	render() {
		const items = this.props.items || [];
		let max = this.props.start + items.length;
		const list = items.map((item) => {
			max--;
			return (<li key={item.commentId} data-i={max}>
				<span>
					<Avatar value={item.avatar} />
					<strong>{item.userName}</strong>
					<time>{moment(item.dateOfModify).format('YYYY/MM/DD HH:mm:ss')}</time>
				</span>
				<div>{renderHTML(item.body || '')}</div>
	
			</li>);
		});

		return (<ol className="numbered-list">
			{list}
		</ol>)
	};
}