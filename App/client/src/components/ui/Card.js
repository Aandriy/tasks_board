import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import Tooltip from './Tooltip';
import Progress from './Progress';
import ManageTask from '../ManageTask/ManageTask';
import ViewTask from '../ManageTask/ViewTask';
import { pipes } from '../../utility';
import renderHTML from 'react-render-html';


export default class Card extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		purpose: PropTypes.string.isRequired,
		id: PropTypes.number.isRequired,
		dateOfStart: PropTypes.number.isRequired,
		owner: PropTypes.string.isRequired,
		ownerImg: PropTypes.string,
		timeBound: PropTypes.number,
		editable: PropTypes.bool.isRequired,
		priority: PropTypes.number,
		countComments: PropTypes.number,
		importance: PropTypes.string
	};
	render() {
		const props = this.props;
		const overdue = moment(props.timeBound).valueOf() < moment().valueOf();
		const time = moment(props.timeBound).valueOf() - moment().valueOf();

		let timePercent = 100;
		if (time > 0) {
			const totalDays = ((moment(props.timeBound).valueOf() - moment(props.dateOfStart).valueOf()) / 86400000);
			const daysLeft = totalDays - (time / 86400000);
			timePercent = (100 / totalDays) * daysLeft;
		}
		const linkEdit = () => {
			if (props.editable) {
				return (
					<ManageTask
						className="task-options-item"
						data={{
							id: props.id
						}}
						onDone={props.onDone}
						title="Edit Task"
						getModel="getEditTaskData"
					>
						<span><i className="icon-pencil"></i></span>
					</ManageTask>
				)
			}
			return null;
		};

		const provider = () => {
			if (props.ownerImg) {
				return (<img alt="" draggable="false" src={"/img/user/" + props.ownerImg} />)
			}
			return (<i className="icon-Provider"></i>);
		};
		const comments = (() => {
			if (props.countComments) {
				return (<div className="coments"><Tooltip message="Comeents" ><span className="badge">{props.countComments}</span></Tooltip></div>);
			}
			return null;
		})();
		return (
			<div className={classNames('task', { 'overdue': overdue })} data-i={props.priority} data-importance={props.importance}>
				<div className="task-head">
					<h5 className="task-title">{comments} <span className="task-head-title">
						<ViewTask data={{
							id: props.id
						}}>{props.title}</ViewTask>
					</span></h5>
					<div className="task-options">
						{linkEdit()}
					</div>
				</div>
				<div className="task-body">
					<div className="task-text">
						{renderHTML(props.purpose || '')}
						{props.children}
					</div>
					<div className="task-foot">
						<div className="task-owner">
							<Tooltip message={props.owner} direction="left">
								<div className="task-owner-img">
									{provider()}
								</div>
							</Tooltip>
						</div>
						<div className="d-flex justify-content-end">
							<div className="">
								<Tooltip message={ pipes.time(props.dateOfStart)} direction="right" ><i className="icon-stop-watch icon"></i>
									From {pipes.date(props.dateOfStart)}
								</Tooltip>
							</div>
							<div className="ml-auto">
								<Tooltip message={ pipes.time(props.timeBound)} direction="left"><i className="icon-alarm icon"></i>
									To {pipes.date(props.dateOfStart)}
								</Tooltip>
							</div>
						</div>
						<Progress value={timePercent} />
					</div>
				</div>
			</div>
		);
	}
}
