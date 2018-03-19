import { ajax, deferred } from '../utility';

class CommentService {
	createComment(data, url = '/api/Comment/Manage') {
		return this.ajax({
			url: url,
			data: data
		});
	}
	getComments(data, url = '/api/Comment/GetCommentList/') {
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

export default new CommentService();