export default class UserInviteModel {
	constructor(params = {}) {
		this.boardId = 0;
		this.email = "";

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