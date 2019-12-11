import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';

import { RemmeResult } from '../../components'

class NotFound extends Component {

  render() {
    return (
      <QueueAnim type="right" gutter={30}>
        <RemmeResult key="1" error="404" description="Content not found" />
      </QueueAnim>
    )
  }
}

export default NotFound;
