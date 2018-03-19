import React from 'react';
import ReactDOM from 'react-dom';
import './style/all.css';
import { BrowserRouter, Router } from 'react-router-dom';
import history from './services/history';
import App from './App';

import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import store from './store/store';

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter className="asd">
			<Router history={history}>
				<App />
			</Router>
		</BrowserRouter>
	</Provider>, document.getElementById('root'));
registerServiceWorker();
