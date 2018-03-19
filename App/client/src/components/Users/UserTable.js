
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Boolean } from '../ui';

export default class UserTable extends Component {
	static propTypes = {
		items: PropTypes.array.isRequired,
		edit: PropTypes.func,
		allowTesting: PropTypes.bool
	};
	constructor(props) {
		super(props);
		this.state = {
			data: null
		}
	};
	change(id) {
		return () => {
			this.props.edit(id);
		};
	}

	render() {
		const items = this.props.items || [];
		const image = (user) => {
			if (user.avatar) {
				const url = '/img/user/' + user.avatar;
				return (<img alt="" src={url} />);
			}
			return (<i className="icon-Provider"></i>);
		};
		const canTestTaskth = (this.props.allowTesting) ? <th>Task Test</th> : null;
		const canTestTask = (item)=>{
			if (!this.props.allowTesting) {
				return null;
			}
			return (<td><Boolean value={item.canTestTask} /></td>);
		};

		const list = items.map((item) => {
			return (
				<tr key={item.id}>
					<td><span className="avatar-box">{image(item)}</span></td>
					<td><strong>{item.user}</strong></td>
					<td><Boolean value={item.canReadBoard} /></td>
					<td><Boolean value={item.canСhangeBoard} /></td>
					<td><Boolean value={item.canWriteBoard} /></td>

					<td><Boolean value={item.canReadBacklog} /></td>
					<td><Boolean value={item.canСhangeBacklog} /></td>

					<td><Boolean value={item.canWriteAllTasks} /></td>
					<td><Boolean value={item.canWriteTask} /></td>
					<td><Boolean value={item.canWriteComment} /></td>
					
					<td><Boolean value={item.canAcceptTask} /></td>
					<td><Boolean value={item.canCloseTask} /></td>
					<td><Boolean value={item.canWriteAccess} /></td>
					{canTestTask(item)}
					<td><span className="btn btn-dark" onClick={this.change(item.id)}>Сhange</span></td>
				</tr>);
		});

		return (<table className="table table-striped table-bordered">
			<colgroup>
			<col width="56" />
			<col />
			</colgroup>
			<thead className="thead-dark">
				<tr>
					<th></th>
					<th>User</th>
					<th>Board Read</th>
					<th>Board Сhange</th>
					<th>Board Write</th>
					
					<th>Backlog Read</th>
					<th>Backlog hange</th>

					<th>All Task Write</th>
					<th>Task Write</th>
					<th>Comment Write</th>
					
					<th>Task Accept</th>
					<th>Task Close</th>
					<th>Access Write</th>
					{canTestTaskth}
					<th></th>
				</tr>
			</thead>
			<tbody>
				{list}
			</tbody>
		</table>)
	};
}












