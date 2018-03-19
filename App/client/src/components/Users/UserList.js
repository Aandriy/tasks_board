
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from '../ui';

export default class UserList extends Component {
	static propTypes = {
		items: PropTypes.array.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {
			data: null
		}
	};

	render() {
		const items = this.props.items || [];
		const list = items.map((item) => {
			return (
				<li key={item.userId}>
					<Avatar value={item.avatar} />
					<strong>{item.user}</strong>
				</li>);
		});

		return (<ol className="user-list">
			{list}
		</ol>)
	};
}