export default class UserAccessModel {
	constructor(params = {}) {
		this.id = 0
		this.boardId = 0;
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
		this.canWriteAllTasks = false;

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