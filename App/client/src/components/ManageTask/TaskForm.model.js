export default class TaskFormModel {
	constructor(params = {}) {
		this.goalId = 0;
		this.boardId = 0;
		this.priority = 1;
		this.title = "";
		this.purpose ="";
		this.acceptanceCriteria = ""
		this.details = "";
		this.timeBound = ""
		this.ownerId = "";
		this.status = 0;
		this.setting = 1;
		this.closed = false;

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