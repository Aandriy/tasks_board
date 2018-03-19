export default class EditBoardModel {
	constructor(params = {}) {
		this.title = "";
		this.priority = 1;
		this.description = ""
		this.publish = false;
		this.boardId = 0;
		this.allowTesting = false;
		Object.keys(this).forEach((key) => {
			if (typeof (params[key]) !== 'undefined') {
				this[key] = params[key];
			}
		});
	}
}