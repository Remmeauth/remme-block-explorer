import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class SmartLink extends Component {
  render() {
    const { key, link, children } = this.props;
    return (
      link.substring(0, 4) === 'http'
      ? <a key={key} target="_blank" href={link} rel="noopener noreferrer">{children}</a>
      : <Link key={key} to={link}>{children}</Link>
    )
  }
}

export default SmartLink;
