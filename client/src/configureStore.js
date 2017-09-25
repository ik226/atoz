import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import * as asyncInitialState from 'redux-async-initial-state';
import axios from 'axios';
import { Map, fromJS } from 'immutable';

import { markerReducer } from './reducers/markers';
import * as actionCreators from './actionCreators';
import { batchSetMarkers } from './actions/actions';

const reducer = asyncInitialState.outerReducer(combineReducers(
  {
    data: markerReducer,
    asyncInitialState: asyncInitialState.innerReducer
  }
));

const loadStore = (currentState) => {
  console.log(currentState);
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:3000/api/markers')
      .then(response => {
        console.log(response);
        resolve(batchSetMarkers(currentState, response.data));

      })
      .catch(err => {
        reject(console.log('server is not responding'))
      })

  });
}

export const configureStore = () => {

  const middlewares = [];
  middlewares.push(thunk);
  middlewares.push(asyncInitialState.middleware(loadStore));

  if(process.env.NODE_ENV !== 'production'){
    middlewares.push(createLogger());
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    //markerReducer,
    reducer,
    composeEnhancers(applyMiddleware(...middlewares)),

  );
  return store;
};
