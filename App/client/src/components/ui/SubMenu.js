import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SubMenuLink from './SubMenuLink';
import Tooltip from './Tooltip';
import ManageTask from '../ManageTask/ManageTask';
import DisplayBoardSettings from './DisplayBoardSettings';
import BoardService from '../../services/board.service';

export default class SubMenu extends Component {
	static propTypes = {
		boardId: PropTypes.number.isRequired,
		boardName: PropTypes.string.isRequired,
		amountAcceptedTasks: PropTypes.number,
		amountClosedTasks: PropTypes.number,
		amountTasksInBacklog: PropTypes.number,
		amountTotalTasks: PropTypes.number,
		access: PropTypes.object.isRequired,
		data: PropTypes.object.isRequired,
		refreshBoard: PropTypes.func.isRequired

	};
	static defaultProps = {
		amountAcceptedTasks: 0,
		amountClosedTasks: 0,
		amountTasksInBacklog: 0,
		amountTotalTasks: 0
	};
	constructor(props) {
		super(props);
		['onChangeBoardSetting'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	};
	onChangeBoardSetting(query) {
		const data = {
			id: this.props.boardId
		};
		Object.assign(data, query);
		BoardService.setBoardSettings(data).done((response) => {
			this.props.refreshBoard();
		});
	}
	render() {
		const props = this.props;
		const access = props.access || {};
		const display = props.display || {};
		let backlog = null;
		let archive = null;

		const badge = (n) => {
			if (!n) {
				return null;
			}
			return (<span className="badge badge-primary">{n}</span>);
		}

		if (access.canReadBacklog) {
			backlog = (<SubMenuLink to={`/Backlog/${props.boardId}`} title="Backlog" active={props.current === 'Backlog'}> {badge(props.amountTasksInBacklog)}</SubMenuLink>);
		}
		if (access.canCloseTask) {
			archive = (<SubMenuLink to={`/Archive/${props.boardId}`} title="Archive" active={props.current === 'Archive'}> {badge(props.amountClosedTasks)}</SubMenuLink>);
		}

		const createTask = (() => {
			if (access.canWriteTask) {
				return (
					<div className="sub-menu-secondary">
						<Tooltip message="Create New Task" direction="left">
							<ManageTask
								data={props.data}
								onDone={props.refreshBoard}
								title="Create New Task"
								getModel="getCreateTaskData"
							>
								<span className="link"><i className="icon-plus"></i></span>
							</ManageTask>
						</Tooltip>
					</div>
				);
			}
			return null;
		})();
		return (
			<div className="sub-menu">
				{createTask}
				<b className="sub-menu-title">{props.boardName}</b>
				<DisplayBoardSettings
					onChange={this.onChangeBoardSetting}
					onlyEditableSection={display.onlyEditableSection}
					onlyMineTasks={display.onlyMineTasks}
					data={props.data}
					refreshBoard={props.refreshBoard}
				/>
				<div className="sub-menu-group left">
					<SubMenuLink to={`/Board/${props.boardId}`} title="Board" active={props.current === 'Board'}> {badge(props.amountTasksInDashboard)}</SubMenuLink>
					{backlog}
					{archive}
				</div>
			</div>
		);
	}
}