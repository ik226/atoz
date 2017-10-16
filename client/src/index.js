import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';

import { Provider } from 'react-redux';

import './index.css';
import { AppContainer } from './App';
import registerServiceWorker from './registerServiceWorker';
import { configureStore } from './configureStore';

let store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
