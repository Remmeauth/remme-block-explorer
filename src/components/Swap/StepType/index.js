import './style.css';

import React, { Component } from "react";
import { Row, Col } from 'antd';

import eth_rem from "../../../assets/eth_to_rem.png"
import rem_eth from "../../../assets/rem_to_eth.png"

class StepType extends Component {

  render() {
    const { onSubmit } = this.props;
    const IE = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent);
    return (
      <React.Fragment>
        { IE ? <h5 className="step-title">Your browser is not supported.<br/>We recommend using Chrome, Firefox or Safari.</h5> : <React.Fragment>
            <h5 className="step-title">Select type of swap:</h5>
            <Row gutter={16} className="align-center">
              <Col className="gutter-row" span={12}>
                <div className="select-type color-background" onClick={() => onSubmit({type:0, current: 1})}><img src={eth_rem} alt="" /></div>
              </Col>
              <Col className="gutter-row" span={12}>
                <div className="select-type color-background" onClick={() => onSubmit({type:1, current: 1})}><img src={rem_eth} alt="" /></div>
              </Col>
            </Row>
          </React.Fragment> }
      </React.Fragment>
    )
  }
}

export default StepType;
