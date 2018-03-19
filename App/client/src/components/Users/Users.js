
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserService from '../../services/user.service';
import { Loading, Pagination } from '../ui';
import UserList from './UserList';
import UserTable from './UserTable';
import UserInviteForm from './UserInviteForm';
import UserInviteModel from './UserInvite.model';
import UserAccessModel from './UserAccess.model';
import UserAccessForm from './UserAccessForm';

export default class Users extends Component {
	static propTypes = {
		boardId: PropTypes.number.isRequired,
		editable: PropTypes.bool.isRequired,
		allowTesting: PropTypes.bool
	};
	constructor(props) {
		super(props);
		this.state = {
			comments: [],
			page: 1,
			total: 1,
			isLoading: true,
			editUserAccess: false,
			userAccessData: null
		}
		this.refresh = this.refresh.bind(this);
		this.changePage = this.changePage.bind(this);
		this.editUserAccess = this.editUserAccess.bind(this);
		this.hideUserAccess = this.hideUserAccess.bind(this);
	};
	componentDidMount() {
		this.getData();
	};

	getData(page) {
		if (!page) {
			page = this.state.page;
		}
		const query = {
			id: this.props.boardId,
			page: page
		};
		UserService.getUsers(query).done((response) => {
			const newState = {
				isLoading: false,
				users: response.items || [],
				page: response.page || 1,
				total: response.totalPage || 1
			};
			this.setState(newState);
		});
	};

	changePage(page) {
		this.getData(page);
	};
	refresh() {
		this.getData();
	};

	editUserAccess(id) {
		this.setState({
			editUserAccess: true,
			userAccessData: id
		});
	}
	hideUserAccess() {
		this.getData();
		this.setState({
			editUserAccess: false,
			userAccessData: null
		});

	}

	render() {
		const state = this.state;
		const props = this.props;
		const id = props.boardId;

		if (state.isLoading) {
			return <Loading />
		}
		const model = new UserInviteModel({
			boardId: id
		});

		const list = () => {
			if (props.editable) {
				return (<UserTable items={state.users} edit={this.editUserAccess} allowTesting={props.allowTesting} />)
			}
			return (<UserList items={state.users} />);
		};
		if (state.userAccessData && state.editUserAccess) {
			let data = state.users.filter((item) => { return item.id === state.userAccessData });
			if (data.length === 1) {
				data = data.pop();
				const model = new UserAccessModel(data);
				return (
					<section>
						<UserAccessForm model={model} onManage={this.hideUserAccess} allowTesting={props.allowTesting} onClose={this.hideUserAccess} >
							<h2 className="display-4">{data.user} <b>assess</b></h2>
						</UserAccessForm>
					</section>
				);
			}


		}
		return (
			<section>
				<h2 className="display-4">Users</h2>
				{list()}
				<Pagination current={state.page} total={state.total} callback={this.changePage} />
				<hr />
				<UserInviteForm model={model} onManage={this.refresh} />
			</section>
		);
	};
}