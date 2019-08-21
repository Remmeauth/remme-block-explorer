import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';

import { RemmeResult } from '../../components'

class Coming extends Component {

  render() {
    return (
      <QueueAnim type="right" gutter={30}>
        <RemmeResult key="1" error="Coming Soon" description="We are actively working on it, so check back soon!" />
      </QueueAnim>
    )
  }
}

export default Coming;
