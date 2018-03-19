import history from '../services/history';
import $ from "jquery";
import _deferred from './deferred';

var instance;
class Ajax {
	
	submit(settings = {}) {
		const deferred = _deferred();
		const options = Object.assign({
			statusCode: {
				404: () => {
					setTimeout(()=>{
					//	history.push('/NotFound');
					},10);
				}
			},
			dataType: 'json',
			headers: {
				'Accept': 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/json'
			},
			url: '/',
			method: 'post',
			data: null,
		}, settings);

		if (options.data) {
			options.data = JSON.stringify(options.data);
		}
		$.ajax(options)
			.done((response) => {
				deferred.resolve(response);
				if (response && response.redirect) {
					history.push(response.redirect);
				}
			})
			.fail((error) => {
				deferred.reject(error);
			});
		return deferred;
	};
};

instance = new Ajax();


export default instance;