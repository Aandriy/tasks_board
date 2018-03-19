import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ValidationMessage from './ValidationMessage';

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default class WysiwygFormGroup extends Component {
	static propTypes = {
		field: PropTypes.func.isRequired,
		onFieldChange: PropTypes.func.isRequired,
		label: PropTypes.string.isRequired,
		id: PropTypes.string
	};

	constructor(props) {
		super(props);
		const editorState = this.addEditorState();
		this.state = {
			editorState,
		};

		['onEditorStateChange'].forEach((key) => {
			this[key] = this[key].bind(this);
		});
	};
	onEditorStateChange(editorState) {
		const val = draftToHtml(convertToRaw(editorState.getCurrentContent()));
		this.props.onFieldChange(val);
		this.setState({ editorState });
	}
	addEditorState(){
		const html = this.props.field() || '';
		if (!html) {
			return EditorState.createEmpty();
		}
		const contentBlock = htmlToDraft(html);
		let editorState;
		if (contentBlock) {
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
			editorState = EditorState.createWithContent(contentState);
		} else {
			editorState = EditorState.createEmpty();
		}
		return editorState;
	}
	render() {
		const props = this.props;
		const field = props.field;
		let { editorState } = this.state;
		
		
		const val = draftToHtml(convertToRaw(editorState.getCurrentContent()));
		const html = props.field() || '';

		if (val !==  html) {
			if (!(val === '<p></p>' && !val)) {
				editorState = this.addEditorState();
			}
		}

		const isRequired = () => {
			if (field.isRequired) {
				return (<span className="required">*</span>)
			}
			return null;
		};
		const editorClassName = classNames('rdw-editor', { 'is-invalid': field.isModifiedAndInvalid });
		return (
			<div className="form-group">
				<label>{props.label}{isRequired()}</label><br />
				<Editor
					editorState={editorState}
					toolbarClassName="rdw-toolbar"
					wrapperClassName="rdw-wrapper"
					editorClassName={editorClassName}
					onEditorStateChange={this.onEditorStateChange}
				/>
				<ValidationMessage field={field} />
			</div>
		)
	}
}
