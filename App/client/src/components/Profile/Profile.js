import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UploadImage } from '../ui';
import UserService from '../../services/user.service';
import ProfileForm from './ProfileForm';


class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit: false,
			showUploadImage: false
		};

		['showForm', 'saveImage', 'toggleUploadImage', 'hideForm','onSubmit'].forEach((key) => {
			this[key] = this[key].bind(this);
		});

	};
	toggleUploadImage() {
		this.setState({ showUploadImage: !this.state.showUploadImage });
	};
	saveImage(data) {
		UserService.setAvatar(data.file).done(() => {
			UserService.getCurrentUser().done(() => {
				this.toggleUploadImage();
			});
		});
	};
	showForm() {
		this.setState({ edit: true });
	}
	hideForm() {
		this.setState({ edit: false });
	}
	onSubmit(){
		UserService.getCurrentUser();
		this.setState({ edit: false });
	}
	render() {
		const state = this.state;
		const props = this.props;
		const user = props.user;
		const uploadImg = () => {
			if (!state.showUploadImage) {
				return null;
			}
			return (<UploadImage
				onClose={this.toggleUploadImage}
				onSave={this.saveImage}
				maxWidth={200}
				maxHeight={200}
				maxSize={100}
			/>);
		};
		const image = () => {
			if (user.avatar) {
				const url = '/img/user/' + user.avatar;
				return (<div className="img-thumbnail"><img alt="" className="avatar " src={url + '?i=' + state.i} /></div>);
			}
			return (<span>N/A</span>);
		};
		const userSection = state.edit ?
			(<ProfileForm model={{ fullName: user.name }} onCancel={this.hideForm} onSubmit={this.onSubmit} />) :
			(<p><b>User Name</b > {user.name} < span className="btn btn-primary" onClick={this.showForm} ><i className="icon-pencil"></i></span ></p >);
		return (
			<div className="d-table-row ">
				<div className="container-fluid py-md-3">
					<div className="card"  >
						{image()}
						<div className="card-body">
							<h1>Profile</h1>
							<div className="card-text">
								{userSection}
								<p><b>Profile Image</b><br /> </p>
								<p><span className="btn btn-primary" onClick={this.toggleUploadImage}>Upload image</span></p>
								{uploadImg()}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Profile);