import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import App from '../App';
import Home from '../pages/Home';
import Wallet from '../pages/Wallet';
import Block from '../pages/Block';
import Transaction from '../pages/Transaction';
import Account from '../pages/Account';
import SwapInit from '../pages/SwapInit';
import Swap from '../pages/Swap';
import PrivateRouter from './PrivateRoute';
import Coming from '../pages/Coming';
import NotFound from '../pages/NotFound'

export default () => (
  <Router>
    <App>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/wallet" component={Wallet} />
        <Route exact path="/block/:id" component={Block} />
        <Route exact path="/transaction/:id" component={Transaction} />
        <Route exact path="/account/:id" component={Account} />
        <Route exact path="/init-swap" component={SwapInit} />
        <PrivateRouter exact path="/swap" component={Swap} />
        <Route exact path="/coming" component={Coming} />

        <Route component={NotFound} />
      </Switch>
    </App>
  </Router>
);
