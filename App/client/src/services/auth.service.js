import { ajax, deferred } from '../utility';
class AuthService {
	submit(query) {
		const url = '/api/Auth/Account/ForgotPassword/';
		ajax.submit({
			url: url,
			data: query
		}).done(function (data) {
			if (!data) {

			} else {
				if (data.isAuthenticated) {
					window.location.href = '/Login';
				}
			}
		});
	}
	forgotPassword(data, url = '/api/Auth/Account/ForgotPassword/') {
		return this.ajax({
			url: url,
			data: data
		});
	};

	resetPassword(data, url = '/api/Auth/Account/ResetPassword/') {
		return this.ajax({
			url: url,
			data: data
		});
	};
	setUserData(data, url = '/api/Auth/Account/SetUserData/') {
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

export default new AuthService();