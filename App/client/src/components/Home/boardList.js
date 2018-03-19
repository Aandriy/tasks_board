import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from '../ui';
import ManageBoard from '../ManageBoard/ManageBoard';
import ViewBoard from '../ManageBoard/ViewBoard';

import BoardService from '../../services/board.service';
import { boardsListSetAction } from '../../actions/boardsListSetAction';

class BoardList extends Component {
	constructor(props) {
		super(props);
		this.getData = this.getData.bind(this);
	};
	componentDidMount() {
		this.getData();
	}
	getData() {
		BoardService.getBoards().done((response) => {
			if (response && Array.isArray(response)) {
				this.props.boardsListSetAction(response)
			}
		});
	};

	render() {
		var boards = this.props.boardList;
		const count = boards.length;
		
		const writeBoard = (item) => {
			if (item.canWriteBoard) {
				return (<div className="p-2">
					<Tooltip message="Edit" direction="left" >
						<ManageBoard
							data={{ id: item.boardId }}
							onDone={this.getData}
							title={`Edit ${item.title}`}
						>
							<span><i className="icon-pencil"></i></span>
						</ManageBoard>
					</Tooltip>
				</div>);
			}
			return null;
		};
		const archiveBoard = (item) => {
			if (item.canCloseTask) {
				return (<div className="p-2">
					<Tooltip message="Archive" direction="left" >
						<Link to={`/Archive/${item.boardId}`}>
							<span><i className="icon-database"></i></span>
						</Link>
					</Tooltip>

				</div>);
			}
			return null;
		};

		const boars = () => {
			return boards.map((item) => {
				return (<div key={item.boardId} className="list-group-item" >
					<div className="d-flex">
						<div className="mr-auto p-2">
							<Link to={`/Board/${item.boardId}`}><strong title={item.description}>{item.title}</strong> {item.description}</Link>
						</div>
						{archiveBoard(item)}
						<div className="p-2">
							<Tooltip message="Details" direction="left" >
								<ViewBoard data={{ id: item.boardId }} onCloce={this.getData}>
									<span><i className="icon-file-text2"></i></span>
								</ViewBoard>
							</Tooltip>
						</div>
						{writeBoard(item)}
					</div>
				</div>);
			});
		}
		
		return <div>
			<div className="list-group">
				<ManageBoard className="list-group-item active" data={{}} onDone={this.getData} title="Create New Board">Create new Board</ManageBoard>
			</div>
			{boars()}
			<div className="list-group-item" >
				boardList {count}
			</div>
		</div>;
	}
}
function mapStateToProps(state) {
	return {
		boardList: state.boardList
	}
}
function matchDispatchToProps(dispatch) {
	return bindActionCreators({ boardsListSetAction: boardsListSetAction }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(BoardList);