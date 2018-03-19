import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Avatar extends Component {
	static propTypes = {
		value: PropTypes.string
	};
	render() {
		const props = this.props;
		const image = () => {
			if (props.value) {
				const url = '/img/user/' + props.value;
				return (<img alt=""  src={url} />);
			}
			return (<i className="icon-Provider"></i>);
		};
		return (<span className="avatar-box">{image()}</span>)
	}
}
