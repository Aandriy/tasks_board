import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tooltip from './Tooltip';



export default class UploadImage extends Component {
	static propTypes = {
		onClose: PropTypes.func.isRequired,
		onSave: PropTypes.func.isRequired,
		maxWidth: PropTypes.number.isRequired,
		maxHeight: PropTypes.number.isRequired,
		maxSize: PropTypes.number.isRequired,
		allowedMIMETypes: PropTypes.string
	};
	static defaultProps = {
		allowedMIMETypes: "image/gif, image/jpg, image/jpeg, image/png, image/x-png"
	};
	constructor(props) {
		super(props);
		this.state = {
			error: '',
			image: {},
			showUploadImage: false
		}

		this.onClose = this.onClose.bind(this);
		this.onSave = this.onSave.bind(this);

		[
			'_handlerDragover',
			'_handlerDragenter',
			'_handlerDrop',
			'_handlerDragleave',
			'_handlerChangeFileInput',
			'_onBrowse',
			'_handlerConvert'
		].forEach((key) => {
			this[key] = this[key].bind(this);
		});
		this._build();

	};
	componentWillUnmount() {
		this._input.onchange = null;
		delete this._input;
		delete this._fragment;
	}
	onSave() {
		this.props.onSave(this.state.image);
	}
	onClose() {
		this.props.onClose();
	}
	_handlerChangeFileInput(e) {
		var item = e.currentTarget;
		if (item.files && item.files.length) {
			this._process(item.files[0]);
		}
		item.value = '';
	};
	_build() {
		const props = this.props;
		const fragment = document.createDocumentFragment();
		const input = document.createElement("INPUT");
		input.setAttribute("type", "file");
		input.setAttribute("accept", props.allowedMIMETypes);
		fragment.appendChild(input);
		this._input = input;
		this._fragment = fragment;
		input.onchange = this._handlerChangeFileInput;
	};

	_handlerDragover(e) {
		e.preventDefault();
	};
	_handlerDragenter() {
		this.setState({
			dragenter: true
		});
	};
	_handlerDragleave() {
		this.setState({
			dragenter: false
		});
	};

	_handlerDrop(e) {
		e.preventDefault();
		const state = this.state;
		const droppedFiles = e.dataTransfer.files;

		if (state.dragenter) {
			this.setState({
				dragenter: false
			});
		}

		if (droppedFiles && droppedFiles.length) {
			const droppedFile = droppedFiles[0];
			this._process(droppedFile);
		}
	};
	_handlerConvert() {
		const img = this.state.image;
		this._convertToPNG(img.name, img.file, img.width, img.height);
	}
	_process(droppedFile) {
		const reader = new FileReader();
		reader.onloadend = () => {
			const img = new Image();
			img.onerror = () => {
				this._imageFailLoaded(droppedFile.name);
			};
			img.onload = () => {
				this._imageLoaded(img.width, img.height, reader.result, droppedFile.size, droppedFile.name);
			}
			img.src = reader.result;
		};
		reader.readAsDataURL(droppedFile);
	};
	_imageFailLoaded(name) {
		const newState = {
			error: '',
			image: {}
		};
		newState.error = 'Not a image';
		newState.image = {
			width: 0,
			height: 0,
			name: name,
			size: 0
		};
		this.setState(newState);
	}
	_imageLoaded(width, height, fileStr, size, name) {
		const props = this.props;
		const newState = {
			error: '',
			image: {}
		};
		const image = {
			width: width,
			height: height,
			file: fileStr,
			name: name,
			size: size / 1000
		}
		newState.image = image;
		if ((image.width > props.maxWidth) || (image.height > props.maxHeight) || (image.size > props.size)) {
			newState.error = 'Error';
		}
		this.setState(newState);
	};
	_onBrowse() {
		this._input.click();
	};
	_convertToPNG(name, fileStr) {
		const img = new Image();
		const props = this.props;

		img.onerror = () => {
			this._imageFailLoaded(name);
		};
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const w = props.maxWidth;
			const h = props.maxHeight;
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext('2d');
			
			/// default offset is center
			let offsetX = 0.5;
			let offsetY = 0.5;
			let iw = img.width,
				ih = img.height,
				r = Math.min(w / iw, h / ih),
				nw = iw * r,   /// new prop. width
				nh = ih * r,   /// new prop. height
				cx, cy, cw, ch, ar = 1;
		
			/// decide which gap to fill    
			if (nw < w) {
				ar = w / nw;
			}
			if (nh < h) {
				ar = h / nh;
			}
			nw *= ar;
			nh *= ar;
		
			/// calc source rectangle
			cw = iw / (nw / w);
			ch = ih / (nh / h);
		
			cx = (iw - cw) * offsetX;
			cy = (ih - ch) * offsetY;
		
			/// make sure source rectangle is valid
			if (cx < 0) {
				cx = 0;
			}
			if (cy < 0) {
				cy = 0;
			}
			if (cw > iw) {
				cw = iw;
			}
			if (ch > ih) {
				ch = ih;
			}
		
			ctx.drawImage(img, cx, cy, cw, ch,  0, 0, w, h);
			const dataUri = canvas.toDataURL();
			const length = dataUri.length - (dataUri.indexOf(';base64,') + 8);
			const dataSize = Math.round(length * 3 / 4);
			this._imageLoaded(props.maxWidth, props.maxHeight, dataUri, dataSize, name.replace(/\.\w{3,4}$/, '.png'));
		}
		img.src = fileStr;
	};
	render() {
		const props = this.props;
		const state = this.state;
		const pic = state.image;
		const picture = () => {
			if (state.image.file) {
				let modify = null;
				if (state.image.width > props.maxWidth || state.image.height > props.maxHeight) {
					modify = (<Tooltip message="Fast solution"><span className="btn btn-primary" onClick={this._handlerConvert}><i className="icon-power"></i></span></Tooltip>);
				}
				return (<div className="upload-image-thumbnail">{modify}<img alt="" src={state.image.file} /><hr /></div>);
			}
			return null;
		};
		const save = () => {
			if (!state.error && state.image.file) {
				return (<button type="button" className="btn btn-primary" onClick={this.onSave}>Save changes</button>);
			}
			return null;
		};
		const isValid = (a, b) => {
			if (!a || !b) {
				return null;
			}
			if (a < b) {
				return (<i className="icon-close text-danger"></i>);
			}
			return (<i className="icon-Arrow text-success"></i>);
		};
		const details = (() => {
			if (!state.image.file) {
				return null;
			}
			return (
				<table className="table">
					<colgroup>
						<col />
						<col width="60" />
						<col width="28" />
						<col />
					</colgroup>
					<thead>
						<tr>
							<th colSpan="2">Conditions</th>
							<th></th>
							<th>File</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th>Max Width</th>
							<td>{props.maxWidth}px</td>
							<td>{isValid(props.maxWidth, pic.width)}</td>
							<td>{pic.width}</td>
						</tr>
						<tr>
							<th>Max Height</th>
							<td>{props.maxHeight}px</td>
							<td>{isValid(props.maxHeight, pic.height)}</td>
							<td>{pic.height}</td>
						</tr>
						<tr>
							<th>Max Size</th>
							<td>{props.maxSize}kb</td>
							<td>{isValid(props.maxSize, pic.size)}</td>
							<td>{pic.size}</td>
						</tr>
					</tbody>
				</table>
			);
		})();
		return (
			<div
				className={classNames('upload-image', { 'dragenter': state.dragenter })}
				onDragOver={this._handlerDragover}
				onDragEnter={this._handlerDragenter}
				onDrop={this._handlerDrop}
				onDragLeave={this._handlerDragleave}
			>

				<div className="upload-image-frame modal-content ">
					<div className="modal-body">
						<span className="upload-image-control">
							<span className="btn btn-primary" onClick={this._onBrowse}>Browse</span>
							<i className="icon-cloud-upload text-primary"></i>
							Drop files here or Or
						</span>
						{picture()}
						{pic.name}
						{state.error}
						{details}
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.onClose}>Close</button>
						{save()}
					</div>
				</div>
			</div >)
	}
}
