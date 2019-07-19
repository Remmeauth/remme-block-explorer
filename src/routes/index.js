import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from '../App';
import Home from '../pages/Home';
import Block from '../pages/Block';

export default () => (
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/block/:id" component={Block} />
      </Switch>
    </App>
  </Router>
);
