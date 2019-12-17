import "typeface-open-sans";

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import jwt from "jsonwebtoken";


import 'ant-design-pro/dist/ant-design-pro.css';
import 'antd/dist/antd.css';

import './index.css';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';

import Routes from './routes';
import rootReducer from "./reducers";

import { start, login, set } from "./actions";

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

const conf = localStorage.getItem("conf");
conf && store.dispatch(set(JSON.parse(conf)));

const swap = localStorage.getItem("swap");
swap && store.dispatch(start(JSON.parse(swap)));

const token = localStorage.getItem("token");
if (token) {
  const data = jwt.decode(token);
  if (data) {
    store.dispatch(login(data));
  }
};

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
);

unregisterServiceWorker();
