import './style.css';

import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { Steps, Popover } from 'antd';

import { start, login } from "../../../actions";
import StepContent from '../StepContent';
import { availableSwaps, updateStore } from '../../../functions/helpers'

const Step = Steps.Step;

const steps = [
  { title: 'Swap Direction' },
  { title: 'Ethereum Wallet' },
  { title: 'Remme Wallet' },
  { title: 'Initiate' }
];

class CreateSteps extends Component {

  state = {
      initiated: false,
      current: 0,
      type: 0,
  };

  next = (update_params) => {
    const { start, login } = this.props
    if (!availableSwaps()) {
      const current = update_params.current !== undefined ? update_params.current : this.state.current + 1;
      this.setState({
        ...update_params,
        current
      });
    } else {
      updateStore(start, login);
      this.setState({ initiated: true });
    }
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  customDot = (dot, { status, index }) => (
    <Popover content={<span>step {index} status: {status}</span>}>
      {dot}
    </Popover>
  );

  render() {
    const { current, type, PrivateKeyRem, PrivateKeyEth, AccountNameRem, OwnerKeyRem, ActiveKeyRem, initiated } = this.state;
    return (
      <div className="steps-wrap">
        { initiated && <Redirect to="/swap" /> }
        <Steps current={current} progressDot={this.customDot}>
          {steps.map(item => <Step key={item.title} title={item.title} />)}
        </Steps>

        <div className="steps-content">
          <StepContent
            current={current}
            type={type}
            PrivateKeyEth={PrivateKeyEth}
            PrivateKeyRem={PrivateKeyRem}
            AccountNameRem={AccountNameRem}
            OwnerKeyRem={OwnerKeyRem}
            ActiveKeyRem={ActiveKeyRem}
            handleSubmit={this.next}
          />
        </div>
      </div>
    )
  }
}

export default connect(null, { start, login })(CreateSteps);
