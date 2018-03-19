import { combineReducers } from 'redux';
import BoardListReducers from './boardList';
import BoardReducers from './board';

import UserReducers from './user';

const allReducers = combineReducers({
	boardList: BoardListReducers,
	board: BoardReducers,
	user: UserReducers
});
export default allReducers;