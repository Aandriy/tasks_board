const boards = {};
export default function (state = null, action) {
	switch (action.type) {
		case 'BOARD_SET':
			const id = action.payload.boardId;
			let data = action.payload;
			if (boards[id]) {
				Object.assign(boards[id], data);
				data = boards[id];
			} else {
				boards[id] = data;
			}
			const result = {};
			Object.assign(result, data)
			return result;
		default:
			return state;
	}
}