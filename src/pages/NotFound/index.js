import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import QueueAnim from 'rc-queue-anim';

import { RemmeResult } from '../../components'

class NotFound extends Component {

  render() {
    return (
        <Route render={({ staticContext }) => {
          if (staticContext) {
            staticContext.status = 404;
          }
          return (
            <div>
              <h1>404 : Not Found</h1>
            </div>
          )
        }}/>
      );
  }
}

export default NotFound;
