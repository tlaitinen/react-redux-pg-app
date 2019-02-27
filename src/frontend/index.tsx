import 'babel-polyfill';
import {createStore, applyMiddleware} from 'redux';
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Route, Router} from 'react-router-dom';
import {createBrowserHistory} from 'history';
import {Provider} from 'react-redux';
import './styles.scss';

import {rootReducer} from './reducers';
import {createLogger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import polyfills from './polyfills';
import App from './containers/app';
import {mkRoot as mkRootSaga} from './actions/root-saga';
const meta = document.createElement('meta');
meta.name = 'viewport';
meta.content = 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no';
if (document.head) {
  document.head.appendChild(meta);
}

const bootstrap = async () => {
  const logger = createLogger();
  const history = createBrowserHistory();
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [];
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(logger);
  }
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware, ...middlewares));
  const appEl = document.createElement('main');
  document.body.appendChild(appEl);
  const rootSaga = mkRootSaga(history);
  sagaMiddleware.run(rootSaga);
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route path='/' component={App}/>
      </Router>
    </Provider>,
    appEl
  );
};

polyfills(bootstrap);
