export default class EditCommentModel {
	constructor(params = {}) {
		this.commentId = 0;
		this.goalId = 0;
		this.body = "";

		Object.keys(this).forEach((key) => {
			let val = params[key];
			if (typeof (val) !== 'undefined') {
				if (val === null) {
					val = '';
				}
				this[key] = val;
			}
		});
	}
}