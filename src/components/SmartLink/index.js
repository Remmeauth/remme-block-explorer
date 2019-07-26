import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class SmartLink extends Component {
  render() {
    const { id, link, children } = this.props;
    return (
      link.substring(0, 4) === 'http'
      ? <a key={id} target="_blank" href={link} rel="noopener noreferrer">{children}</a>
      : <Link key={id} to={link}>{children}</Link>
    )
  }
}

export default SmartLink;
