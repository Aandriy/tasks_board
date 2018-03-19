import React, { Component } from 'react';
import { connect } from 'react-redux';
import BoardService from '../../services/board.service';
import { Loading, Card, SubMenu } from '../ui';
import moment from 'moment';

class ArchiveBoard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			boardId: parseInt(this.props.match.params.id, 10) || 0,
			isLoad: false,
			taskWrite: false,
			tasks: []
		};
	};
	componentWillMount() {
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
		BoardService.getClosedTasks(id);
	};

	render() {
		const state = this.state;
		const props = this.props;
		let board = props.board;
		if (board) {
			if (board.boardId !== state.boardId){
				board = null;
			}
		}
		if (!board) {
			return <Loading />
		}
		const tasks = board.archiveTasks || [];
		const access = board.access;
		const items = tasks.map((item) => {
			const options = {
				boardId: item.boardId,
				title: item.title,
				purpose: item.purpose,
				timeBound: moment(item.timeBound).valueOf(),
				owner: item.owner,
				ownerImg: item.ownerImg,
				dateOfStart: moment(item.dateOfCreation).valueOf(),
				id: item.goalId,
				editable: item.isEditable,
				priority: item.priority,
				countComments: item.countComments || 0,
				importance: board.taskSettings[item.setting],
				onDone: () => { }
			};
			return (<div key={item.goalId} className="d-inline-block w-100"><Card {...options} /></div>)
		});
		const content = !tasks.length ? (<div>no closed tasks</div>) : (<div className="multi-column">{items}</div>);
		return (
			<div>
				<SubMenu
					current="Archive"
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
				>
				</SubMenu>
				<h1>Archive</h1>
				{content}
			</div>
		);
	}
}
function mapStateToProps(state) {
	return {
		board: state.board
	}
}
export default connect(mapStateToProps)(ArchiveBoard);