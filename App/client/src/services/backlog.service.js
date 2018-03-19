import { ajax, deferred, biDirectionalDictionary } from '../utility';
import store from '../store/store';
import { boardSetAction } from '../actions/boardSetAction';

class BacklogService {
	getPrioritizeBacklog(data, url = '/api/Backlog/GetPrioritizeBacklog/') {
		const defer = deferred();
		const response = this.ajax({
			url: url + data.id
		});
		response.done((x) => {
			const toOpen = (typeof (data.toOpen) === 'function') ? data.toOpen() : {};
			const tasks = {
				open: []
			};
			const taskSettings = biDirectionalDictionary(x.taskSettings);
			const taskStatus = biDirectionalDictionary(x.taskStatus);
			Object.keys(taskSettings).forEach((key) => {
				tasks[taskSettings[key]] = [];
			});
			(x.tasks || []).forEach((item) => {
				if (toOpen[item.goalId]) {
					tasks['open'].push(item);
					item.priority = toOpen[item.goalId];
				} else {
					tasks[item.setting].push(item);
				}
			});
			tasks['open'].sort((a, b) => {
				let _a = a.priority;
				let _b = b.priority;
				if (_a < _b) {
					return -1;
				}
				if (_a > _b) {
					return 1;
				}
				return 0;
			});
			x.taskSettings = taskSettings;
			x.taskStatus = taskStatus;
			x.backlogTasks = tasks;
			delete x.tasks;
			store.dispatch(boardSetAction(x));
			defer.resolve(x);
		});
		response.fail(() => {
			defer.reject();
		})
		return defer;
	};

	moveToOpen(query, url = '/api/Backlog/SetOpenTasks') {
		return this.ajax({
			url: url,
			data: query
		});
	};

	changeSettingAndPriority(query, url = '/api/Backlog/ChangeSettingAndPriority') {
		return this.ajax({
			url: url,
			data: query
		});
	};

	getBacklogFromBoard(id, url = '/api/Backlog/GetBacklogFromBoard/') {
		return this.ajax({
			url: url + id
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

export default new BacklogService();