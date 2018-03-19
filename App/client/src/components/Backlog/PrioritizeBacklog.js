import React, { Component } from 'react';
import { connect } from 'react-redux';
import BacklogService from '../../services/backlog.service';
import { Loading, Card, SubMenu } from '../ui';
import { DragAndDrop, DragAndDropContainer } from '../DragAndDrop';
import BacklogColumn from './BacklogColumn';

class PrioritizeBacklog extends Component {
	constructor(props) {
		super(props);
		this.dragAndDrop = new DragAndDrop();
		this.state = {
			boardId: parseInt(this.props.match.params.id, 10) || 0,
			taskStatus: {},
			taskSettings: {},
			tasks: {},
			board: {},
			access: null,
		};
		['getDraggedElement', 'onDropChange', 'onSave', 'getBordData'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	};

	componentWillMount() {
		let id = parseInt(this.props.match.params.id, 10) || 0;

		if (!id) {
			this.props.history.push('/NotFound');
		}
		this.getBordData(id);
	};


	getDraggedElement(data) {
		let id = null
		if (data) {
			id = data.id
		}
		this.setState({ draggedElementId: id });
	};

	getBordData(id) {
		if (typeof (id) === 'undefined') {
			id = this.state.boardId;
		}
		BacklogService.getPrioritizeBacklog({
			id: id, toOpen: () => {
				const tasks = this.state.tasks;
				if (!tasks.open) {
					return {};
				}
				const toOpen = {};
				tasks.open.forEach((item, i) => {
					toOpen[item.goalId] = (i + 1);
				});
				return toOpen;
			}
		}).done((response) => {
			this.setState(response);
		});
	};

	findParentName(parents, item) {
		const names = Object.keys(parents);
		let i = names.length;
		while (i--) {
			let name = names[i];
			if (parents[name].indexOf(item) !== -1) {
				return name;
			}
		}
		return null;
	};
	onDropChange(kit) {
		const states = this.state;
		const taskSettings = states.taskSettings;
		const board = this.props.board;
		const tasks = board.backlogTasks;

		if (kit) {
			const entity = kit.data.entity;
			const from = tasks[this.findParentName(tasks, entity)];
			const to = tasks[kit.category];
			const kitId = +kit.id;

			if (entity.goalId === kitId) {
				return false;
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
					if (to !== tasks.open) {
						item.setting = taskSettings[taskSettings[kit.category]];
					}

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

				i = 1;
				[
					tasks['open'],
					tasks[taskSettings['importantUrgent']],
					tasks[taskSettings['importantNotUrgent']],
					tasks[taskSettings['notImportantUrgent']],
					tasks[taskSettings['notImportantNotUrgent']]
				].forEach((items) => {
					items.forEach((item) => {
						item.priority = i;
						const obj = {
							goalId: item.goalId,
							priority: item.priority,
							setting: item.setting
						};
						query.items.push(obj);
						i++;
					});

				});
				if (query.items.length) {
					BacklogService.changeSettingAndPriority(query).done(() => {
						this.getBordData(query.boardId);
					});
				}
				const newState = { tasks: tasks };
				this.setState(newState)
			}
		}
	};
	onSave() {
		const state = this.state;
		const board = this.props.board;
		const taskStatus = state.taskStatus;
		const tasks = board.backlogTasks;
		const query = {
			boardId: state.boardId,
			items: []
		};
		const start = 1000;
		const open = tasks['open'].splice(0);

		open.forEach((item, i) => {
			const obj = {
				goalId: item.goalId,
				priority: start + i,
				status: taskStatus['open']
			};
			query.items.push(obj);
		});

		const newState = {
			open: state.open
		};
		this.setState(newState);

		BacklogService.moveToOpen(query).done(() => {
			this.getBordData(state.boardId);
		});
	};
	render() {
		const dragAndDrop = this.dragAndDrop;
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
		const access = board.access || {};
		const taskSettings = board.taskSettings;
		const tasks = board.backlogTasks;

		const saveBtn = () => {
			if (tasks.open.length) {
				return (<a className="btn btn-primary float-right" onClick={this.onSave}>Save</a>);
			}
			return null;
		};
		const body = () => {
			if (tasks) {
				return (
					<DragAndDropContainer dragAndDrop={dragAndDrop} avatar={Card} getDraggedElement={this.getDraggedElement} onChange={this.onDropChange} >
						<div className="d-flex flex-nowrap bord-box  h-100">
							<BacklogColumn
								title="Open"
								items={tasks['open']}
								data={access}
								dragAndDrop={dragAndDrop}
								draggedElementId={state.draggedElementId}
								dragAndDropCategory="open"
								locked={!access.canСhangeBacklog}
								taskSettings={taskSettings}
								refreshBoard={this.getBordData}
							>
								{saveBtn()}
							</BacklogColumn>
							<BacklogColumn
								title="Important / Urgent"
								items={tasks[taskSettings['importantUrgent']]}
								data={access} dragAndDrop={dragAndDrop}
								draggedElementId={state.draggedElementId}
								dragAndDropCategory={taskSettings.importantUrgent}
								locked={!access.canСhangeBacklog}
								taskSettings={taskSettings}
								refreshBoard={this.getBordData} />
							<BacklogColumn
								title="Important / not Urgent"
								items={tasks[taskSettings['importantNotUrgent']]}
								data={access} dragAndDrop={dragAndDrop}
								draggedElementId={state.draggedElementId}
								dragAndDropCategory={taskSettings.importantNotUrgent}
								locked={!access.canСhangeBacklog}
								taskSettings={taskSettings}
								refreshBoard={this.getBordData} />
							<BacklogColumn
								title="not Important / Urgent"
								items={tasks[taskSettings['notImportantUrgent']]}
								data={access}
								dragAndDrop={dragAndDrop}
								draggedElementId={state.draggedElementId}
								dragAndDropCategory={taskSettings.notImportantUrgent}
								locked={!access.canСhangeBacklog}
								taskSettings={taskSettings}
								refreshBoard={this.getBordData} />
							<BacklogColumn
								title="not Important / not Urgent"
								items={tasks[taskSettings['notImportantNotUrgent']]}
								data={access}
								dragAndDrop={dragAndDrop}
								draggedElementId={state.draggedElementId}
								dragAndDropCategory={taskSettings.notImportantNotUrgent}
								locked={!access.canСhangeBacklog}
								taskSettings={taskSettings}
								refreshBoard={this.getBordData} />
						</div>
					</DragAndDropContainer>
				);
			}
			return (<Loading />);
		};
		return (
			<div className="d-table-row ">
				<div className="d-flex flex-column h-100">
					<SubMenu
						current="Backlog"
						boardId={state.boardId}
						boardName={board.boardTitle}
						amountAcceptedTasks={board.amountAcceptedTasks}
						amountClosedTasks={board.amountClosedTasks}
						amountTasksInBacklog={board.amountTasksInBacklog}
						amountTotalTasks={board.amountTotalTasks}
						amountTasksInDashboard={board.amountTasksInDashboard}
						access={access}
						display={board.display}
						data={{ id: state.boardId }}
						refreshBoard={this.getBordData}
					/>
					{body()}
				</div>
			</div>);
	};
}
function mapStateToProps(state) {
	return {
		board: state.board
	}
}
export default connect(mapStateToProps)(PrioritizeBacklog);