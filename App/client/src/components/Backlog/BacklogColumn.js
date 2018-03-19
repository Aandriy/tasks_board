import React, { Component } from 'react';
import { Card } from '../ui';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { DragAndDropItem } from '../DragAndDrop';

export default class BacklogColumn extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		items: PropTypes.array.isRequired,
		taskSettings: PropTypes.object.isRequired
	};
	constructor(props) {
		super(props);
		this.state = {

		};
	};

	render() {
		const props = this.props;
		const cards = () => {
			return props.items.map((item) => {
				const options = {
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
					importance: props.taskSettings[item.setting],
					onDone: props.refreshBoard
				};
				if (props.locked) {
					return (
						<div key={item.goalId} className="static-item">
							<Card {...options} />
						</div>
					);
				}
				return (<DragAndDropItem draggedElementId={props.draggedElementId} key={item.goalId} data={{
					itemProps: options,
					entity: item,
					id: item.goalId
				}} dragAndDrop={this.props.dragAndDrop} id={item.goalId}>
					<Card {...options} />
				</DragAndDropItem>)
			});
		}
		return (<section
			className={classNames('align-self-stretch w-25 bord-box-col drag-and-drop-column', {
				'locked': props.locked,
				'available': !props.locked,
			})
			}
			data-category={props.dragAndDropCategory}>
			<h2>{this.props.children}{props.title}</h2>
			{cards()}

		</section>);
	};
}
