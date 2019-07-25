import React, { Component } from 'react'
import { Spin, Icon } from 'antd';

const loadIcon = <Icon type="setting" rotate={180} style={{ fontSize: 24 }} spin />;

class RemmeSpin extends Component {
  render() {
    return (
      <div className="preload-block"><Spin indicator={loadIcon} /></div>
    )
  }
}

export default RemmeSpin;
