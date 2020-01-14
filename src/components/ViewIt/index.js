import React, { Component } from 'react'

import { SmartLink } from '../../components'

class ViewIt extends Component {
  render() {
    const { url } = this.props;
    return (
      <React.Fragment>
          {process.env.REACT_APP_VIEW_ON && <span style={{fontSize: 14, float: 'right', lineHeight: "34px"}}><SmartLink link={`${process.env.REACT_APP_VIEW_ON}${url}${process.env.REACT_APP_VIEW_ON_PARAMS}`}>View It with Bloks.io</SmartLink></span>}
      </React.Fragment>
    )
  }
}

export default ViewIt;
