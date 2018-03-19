import React, { Component } from 'react';
import { connect } from 'react-redux';
import BoardService from '../../services/board.service';
import TaskService from '../../services/task.service';
import { Loading, Card, Progress, SubMenu } from '../ui';
import { DragAndDrop, DragAndDropContainer } from '../DragAndDrop';
import TaskColumn from './TaskColumn';

class Board extends Component {
	constructor(props) {
		super(props);
		this.dragAndDrop = new DragAndDrop();
		this.state = {
			boardId: parseInt(this.props.match.params.id, 10) || 0,
			taskStatus: {},
			access: null,
			tasks: []
		};

		['onDropChange', 'getDraggedElement', 'getBordData'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	};
	componentDidMount() {
		const id = this.state.boardId;
		if (!id) {
			this.props.history.push('/NotFound');
		}
		this.getBordData(id);
	};

	getBordData(id) {
		if (typeof (id) === 'undefined') {
			id = this.state.boardId;
		}
		BoardService.getBoard(id);
	};

	getDraggedElement(data) {
		let id = null
		if (data) {
			id = data.id
		}
		this.setState({ draggedElementId: id });
	};

	onDropChange(kit) {
		const states = this.state;
		const props = this.props;
		const board = props.board;
		const tasks = board.boardTasks;
		const taskStatus = board.taskStatus;
		const reflectTaskStatus = {};
		const access = board.access;

		Object.keys(taskStatus).forEach((key) => {
			reflectTaskStatus[taskStatus[key]] = key;
		})

		if (kit) {
			const entity = kit.data.entity;
			const from = tasks[reflectTaskStatus[entity.status]];
			const to = tasks[reflectTaskStatus[kit.category]];
			if (entity.goalId === +kit.id) {
				return false;
			}
			if (!access.canСhangeBoard) {
				return false;
			}

			switch (taskStatus[kit.category]) {
				case 'accepted':
				case 'rejected':
					if (!access.canAcceptTask) {
						return false;
					}
					break;
				case 'inTesting':
				case 'invalid':
				case 'valid':
					if (!access.canTestTask) {
						return false;
					}
					break;
				default:
					break;
			}

			if (from && to) {
				let item;
				let i = from.length;
				while (i--) {
					if (from[i].goalId === entity.goalId) {
						break;
					}
				}
				if (i !== -1) {
					item = from.splice(i, 1)[0];
					item.status = taskStatus[reflectTaskStatus[kit.category]]
					if (!kit.id) {
						to.push(item);
					} else {
						const temp = to.splice(0);
						temp.forEach((obj) => {
							if (obj.goalId === +kit.id) {
								if (kit.before) {
									to.push(item);
									to.push(obj);
								} else {
									to.push(obj);
									to.push(item);
								}
								item = null;
							} else {
								to.push(obj);
							}
						});
						if (item) {
							to.push(item);
						}
					}
				}

				const query = {
					items: [],
					boardId: states.boardId
				};
				to.forEach((item, i) => {
					const obj = {
						goalId: item.goalId,
						priority: i + 1,
						status: item.status
					};
					query.items.push(obj);
				});

				TaskService.changeStatusAndPriority(query).done(() => {
					this.getBordData(query.boardId);
				});

				const newState = { tasks: tasks };
				this.setState(newState)
			}
		}
	};
	render() {
		const state = this.state;
		const props = this.props;
		let board = props.board;
		
		if (board) {
			if (board.boardId !== state.boardId) {
				board = null;
			}
		}
		if (!board) {
			return (<Loading />);
		}
		const complete = ((100 / board.amountTotalTasks) * (board.amountClosedTasks + board.amountAcceptedTasks)) || 0;
		const dragAndDrop = this.dragAndDrop;
		const access = board.access || {};
		const tasks = board.boardTasks;
		const display = board.display || {};
		const taskStatus = board.taskStatus || {};
		const taskSettings = board.taskSettings || {}

		const testing = () => {
			if (!display.allowTesting || (display.onlyEditableSection && !access.canTestTask)) {
				return null;
			}
			return ([
				<TaskColumn
					key={'inTesting'}
					title="In Testing"
					items={tasks.inTesting}
					data={access}
					dragAndDrop={dragAndDrop}
					draggedElementId={state.draggedElementId}
					dragAndDropCategory={taskStatus.inTesting}
					locked={!access.canTestTask}
					taskSettings={taskSettings}
					refreshBoard={this.getBordData}
				/>,
				<TaskColumn
					key={'invalid'}
					title="Invalid"
					items={tasks.invalid}
					data={access}
					dragAndDrop={dragAndDrop}
					draggedElementId={state.draggedElementId}
					dragAndDropCategory={taskStatus.invalid}
					locked={!access.canTestTask}
					taskSettings={taskSettings}
					refreshBoard={this.getBordData}
				/>,
				<TaskColumn
					key={'valid'}
					title="Valid"
					items={tasks.valid}
					data={access}
					dragAndDrop={dragAndDrop}
					draggedElementId={state.draggedElementId}
					dragAndDropCategory={taskStatus.valid}
					locked={!access.canTestTask}
					taskSettings={taskSettings}
					refreshBoard={this.getBordData}
				/>
			]);
		};
		const finalisedSections = () => {
			if (display.onlyEditableSection && !access.canTaskAccept) {
				return null;
			}
			return ([
				<TaskColumn
					key={'accepted'}
					title="Accepted"
					items={tasks.accepted}
					data={access}
					dragAndDrop={dragAndDrop}
					draggedElementId={state.draggedElementId}
					dragAndDropCategory={taskStatus.accepted}
					locked={!access.canAcceptTask}
					taskSettings={taskSettings}
					refreshBoard={this.getBordData}
				/>,
				<TaskColumn
					key={'rejected'}
					title="Rejected"
					items={tasks.rejected}
					data={access}
					dragAndDrop={dragAndDrop}
					draggedElementId={state.draggedElementId}
					dragAndDropCategory={taskStatus.rejected}
					locked={!access.canAcceptTask}
					taskSettings={taskSettings}
					refreshBoard={this.getBordData}
				/>
			]);
		};
		const body = () => {
			if (tasks) {
				return (<DragAndDropContainer dragAndDrop={dragAndDrop} avatar={Card} getDraggedElement={this.getDraggedElement} onChange={this.onDropChange} >
					<div className="d-flex flex-nowrap bord-box h-100">
						<TaskColumn
							title="Open"
							items={tasks.open}
							data={access}
							dragAndDrop={dragAndDrop}
							draggedElementId={state.draggedElementId}
							dragAndDropCategory={taskStatus.open}
							locked={!access.canСhangeBoard}
							taskSettings={taskSettings}
							refreshBoard={this.getBordData}
						/>
						<TaskColumn
							title="In Progress"
							items={tasks.inProgress}
							data={access}
							dragAndDrop={dragAndDrop}
							draggedElementId={state.draggedElementId}
							dragAndDropCategory={taskStatus.inProgress}
							locked={!access.canСhangeBoard}
							taskSettings={taskSettings}
							refreshBoard={this.getBordData}
						/>
						<TaskColumn
							title="Done"
							items={tasks.done}
							data={access}
							dragAndDrop={dragAndDrop}
							draggedElementId={state.draggedElementId}
							dragAndDropCategory={taskStatus.done}
							locked={!access.canСhangeBoard}
							taskSettings={taskSettings}
							refreshBoard={this.getBordData}
						/>
						{testing()}
						{finalisedSections()}
					</div>
				</DragAndDropContainer>
				);
			} else {
				return (<Loading />);
			}
		};
		return (
			<div className="d-table-row ">
				<div className="container-box">
					<SubMenu
						current="Board"
						boardId={board.boardId}
						boardName={board.boardTitle}
						amountAcceptedTasks={board.amountAcceptedTasks}
						amountClosedTasks={board.amountClosedTasks}
						amountTasksInBacklog={board.amountTasksInBacklog}
						amountTotalTasks={board.amountTotalTasks}
						amountTasksInDashboard={board.amountTasksInDashboard}
						access={access}
						display={board.display}
						data={{ id: board.boardId }}
						refreshBoard={this.getBordData}
					>
					</SubMenu>
					<Progress value={complete} label="Complited" />
					{body()}
				</div>
			</div>
		);
	};
}

function mapStateToProps(state) {
	return {
		board: state.board
	}
}
export default connect(mapStateToProps)(Board);
