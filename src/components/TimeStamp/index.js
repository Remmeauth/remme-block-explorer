import React, { Component } from 'react'
import Moment from 'react-moment';

import { dateFormat } from '../../config.js'

class TimeStamp extends Component {
  render() {
    return (
      <Moment format={dateFormat}>{this.props.timestamp + 'Z'}</Moment>
    )
  }
}

export default TimeStamp;
