import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Tooltip extends Component {
	static propTypes = {
		message: PropTypes.string,
		direction: PropTypes.string
	};
	static defaultProps = {
		direction: "top"
	};


	render() {
		const props = this.props;
		if (!props.children) {
			return null;
		}
		if (!props.message) {
			return props.children;
		}
	const classname = 'popup-box ' + props.direction;
		return (
			<div className={classname}>
				{props.children}
				<div className="popup-box-container">
					<div className="popup-box-holder">
						<div className="popup-box-frame">
							{props.message}
						</div>
					</div>
				</div>
			</div>
			);
	}
}
