import React, { Component } from "react";

import StepType from '../StepType';
import StepEthWallet from '../StepEthWallet';
import StepRemWallet from '../StepRemWallet';
import StepInitiate from '../StepInitiate';

class StepContent extends Component {

  StepSubmit = (data) => {
    this.props.handleSubmit(data)
  }

  render() {
    const { current } = this.props;
    return (
      <React.Fragment>
        {{
         0: (<StepType onSubmit={this.StepSubmit} />),
         1: (<StepEthWallet onSubmit={this.StepSubmit} {...this.props} />),
         2: (<StepRemWallet onSubmit={this.StepSubmit} {...this.props} />),
         3: (<StepInitiate onSubmit={this.StepSubmit} {...this.props} />),
        }[current]}
      </React.Fragment>
    )
  }
}

export default StepContent;
