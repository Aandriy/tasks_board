import { ajax, deferred } from '../utility';

class TaskService {


	createTask(data, url = '/api/Task/Manage') {
		return this.ajax({
			url: url,
			data: data
		});
	}

	getCreateTaskData(id, url = '/api/Task/getCreateTaskData/') {
		if (id) {
			url += id;
		}
		return this.ajax({
			url: url
		});
	};
	getEditTaskData(id, url = '/api/Task/GetEditTaskData/') {
		if (id) {
			url += id;
		}
		return this.ajax({
			url: url
		});
	};
	getTaskDetails(id, url = '/api/Task/GetViewTaskDetails') {
		return this.ajax({
			url: url,
			data: { item: id }
		});
	};

	changeStatusAndPriority(query, url = '/api/Task/ChangeStatusAndPriority') {
		return this.ajax({
			url: url,
			data: query
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

export default new TaskService();