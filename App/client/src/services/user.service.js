import { ajax, deferred } from '../utility';
import store from '../store/store';
import { userSetAction } from '../actions/userSetAction';
class UserService {
	logOff(url = '/api/Auth/Account/LogOff/') {
		return ajax.submit({
			url: url
		});
	};

	login(query, url = '/api/Auth/Account/Login/') {
		return this.ajax({
			url: url,
			data: query
		});
	};

	registerNewUser(query, url = '/api/Auth/Account/Register/') {
		return this.ajax({
			url: url,
			data: query
		});
	};

	getCurrentUser(url = '/api/Home/GetCurrentUser') {
		const defer = deferred();
		this.ajax({
			url: url
		}).done((response) => {
			if (response.user && response.user.name) {
				const user = response.user;
				user.isAuthorized = true;
				store.dispatch(userSetAction(user));
			}
			defer.resolve(response);
		});
		return defer;
	};
	setAvatar(dataUrl, url = '/api/Auth/Account/SaveCoverPicture/') {
		return this.ajax({
			url: url,
			data: { dataUrl: dataUrl }
		});
	};

	getUsers(data, url = '/api/Board/GetBoardUsers/') {
		return this.ajax({
			url: url,
			data: data
		});
	};
	userInvite(data, url = '/api/Board/UserInvite/') {
		return this.ajax({
			url: url,
			data: data
		});
	};
	getUserAccessData(id, url = '/api/Board/GetUserAccessData/') {
		return this.ajax({
			url: url + id
		});
	};

	setUserAccess(data, url = '/api/Board/SetUserAccess/') {
		return this.ajax({
			url: url,
			data: data
		});
	};
	
	ajax(settings) {
		const defer = deferred();
		ajax.submit(settings).done((response) => {
			defer.resolve(response);
		});
		return defer;
	}
}

export default new UserService();