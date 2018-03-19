import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { paging } from '../../utility';

export default class Pagination extends Component {
	static propTypes = {
		current: PropTypes.number.isRequired,
		total: PropTypes.number.isRequired,
		callback: PropTypes.func.isRequired
	};
	clickLasers(page) {
		return () => {
			this.props.callback(page);
		}
	}
	_textItem(str, key) {
		return (<li className="page-item disabled" key={key}>
			<span className="page-link">
				{str}
			</span>
		</li>)
	};
	_activeItem(str, key) {
		return (<li className="page-item  active" key={key}>
			<span className="page-link">
				{str}
			</span>
		</li>)
	};
	_btnItem(str, key) {
		return (<li className="page-item" key={key}><a className="page-link" onClick={this.clickLasers(str)}>{str}</a></li>)
	};
	_previous(current) {
		if (current === 1) {
			return (<li className="page-item disabled">
				<span className="page-link">Previous</span>
			</li>)
		}
		return (<li className="page-item">
			<a className="page-link" onClick={this.clickLasers(current - 1)}>Previous</a>
		</li>)
	};
	_next(current, total) {
		if (current === total) {
			return (<li className="page-item disabled">
				<span className="page-link" >Next</span>
			</li>)
		}
		return (<li className="page-item">
			<a className="page-link" onClick={this.clickLasers(current + 1)}>Next</a>
		</li>)
	};
	render() {
		const props = this.props;
		const total = props.total;
		const current = props.current;
		
		if (total === 1) {
			return null;
		}
		const rules = paging(total, current);
		const mapper = (item, i) => {
			if (item.link) {
				if (item.isActive) {
					return this._activeItem(item.page, i);
				}
				return this._btnItem(item.page, i);

			} else {
				return this._textItem(item.page, i);
			}
		};

		return (<div>
			<nav >
				<ul className="pagination">
					{this._previous(current)}
					{rules.map(mapper)}
					{this._next(current, total)}
				</ul>
			</nav>
		</div>);
	}
}
