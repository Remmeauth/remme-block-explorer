import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from '../App';
import Home from '../pages/Home';
import Block from '../pages/Block';
import Transaction from '../pages/Transaction';
import Producer from '../pages/Producer';

export default () => (
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/block/:id" component={Block} />
        <Route exact path="/transaction/:id" component={Transaction} />
        <Route exact path="/account/:id" component={Producer} />
      </Switch>
    </App>
  </Router>
);
