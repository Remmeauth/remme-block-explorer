import "typeface-open-sans";

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";


import 'ant-design-pro/dist/ant-design-pro.css';
import 'antd/dist/antd.css';

import './index.css';
import registerServiceWorker from './registerServiceWorker';

import Routes from './routes';
import rootReducer from "./reducers";

import { set } from "./actions";

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

const conf = localStorage.getItem("conf");
conf && store.dispatch(set(JSON.parse(conf)));

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
