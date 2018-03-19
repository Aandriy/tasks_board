export default function (state = [], action) {
	switch (action.type) {
		case 'BOARDS_LIST_SET':
			return action.payload
		default:
			return state;
	}
}