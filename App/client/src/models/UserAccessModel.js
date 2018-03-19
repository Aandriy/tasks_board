export default class UserAccessModel {
	constructor(params = {}) {
		this.canWriteAccess = false;
		this.canReadBacklog = false;
		this.canСhangeBacklog = false;
		this.canReadBoard = false;
		this.canWriteBoard = false;
		this.canСhangeBoard = false;
		this.canWriteComment = false;
		this.canAcceptTask = false;
		this.canCloseTask = false;
		this.canTestTask = false;
		this.canWriteTask = false;

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