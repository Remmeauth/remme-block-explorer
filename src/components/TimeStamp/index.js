import React, { Component } from 'react'
import Moment from 'react-moment';

class TimeStamp extends Component {
  render() {
    return (
      <Moment format={process.env.REACT_APP_DATE_FORMAT}>{this.props.timestamp + 'Z'}</Moment>
    )
  }
}

export default TimeStamp;
