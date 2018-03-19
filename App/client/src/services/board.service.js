import { ajax, deferred, biDirectionalDictionary } from '../utility';
import store from '../store/store';
import { boardSetAction } from '../actions/boardSetAction';
class BoardService {
	getBoards(url = '/api/Board/GetBoardList') {
		return this.ajax({
			url: url
		});
	};
	createBoard(data, url = '/api/Board/Manage') {
		return this.ajax({
			url: url,
			data: data
		});
	};
	getBoard(id, url = '/api/Board/GetBoard/') {
		const defer = deferred();
		const response = this.ajax({
			url: url + id
		});
		response.done((x) => {
			const tasks = {};
			const taskSettings = biDirectionalDictionary(x.taskSettings);
			const taskStatus = biDirectionalDictionary(x.taskStatus);
			Object.keys(x.taskStatus).forEach((key) => {
				tasks[key] = x.tasks.filter((item) => {
					return (item.status === x.taskStatus[key]);
				});
			});
			x.taskSettings = taskSettings;
			x.taskStatus = taskStatus;
			x.boardTasks = tasks;
			delete x.tasks;
			store.dispatch(boardSetAction(x));
			defer.resolve(x);
		});
		response.fail(() => {
			defer.reject();
		})
		return defer;
	};
	getBoardDetails(id, url = '/api/Board/GetBoardDetails/') {
		return this.ajax({
			url: url + id
		});
	};
	geEditBoardDetails(id, url = '/api/Board/GetEditBoardDetails') {
		return this.ajax({
			url: url,
			data: { item: id }
		});
	};
	getClosedTasks(id, url = '/api/Board/GetClosedTasks/') {
		const defer = deferred();
		this.ajax({
			url: url + id
		}).done((x) => {
			const taskSettings = biDirectionalDictionary(x.taskSettings);
			const taskStatus = biDirectionalDictionary(x.taskStatus);
			x.taskSettings = taskSettings;
			x.taskStatus = taskStatus;
			x.archiveTasks = x.tasks;
			delete x.tasks;
			store.dispatch(boardSetAction(x));
			defer.resolve(x);
		}).fail(() => {
			defer.reject();
		});
		return defer;
	};
	setBoardSettings(data, url = '/api/Board/SetBoardDisplaySettings/') {
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
	};
}

export default new BoardService();