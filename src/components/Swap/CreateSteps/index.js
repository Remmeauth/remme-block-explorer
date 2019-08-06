import './style.css';

import React, { Component } from "react";
import { Steps, Popover, Button, Icon } from 'antd';

import StepContent from '../StepContent';

const Step = Steps.Step;

const steps = [
  { title: 'Swap Direction' },
  { title: 'Ethereum Wallet' },
  { title: 'Remme Wallet' },
  { title: 'Initiate' }
];

class CreateSteps extends Component {

  state = {
      current: 0,
      type: 0,
  };

  next = (update_params) => {
    const current = update_params.current ? update_params.current : this.state.current + 1;
    this.setState({
      ...update_params,
      current
    });
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
    const { current, type, PrivateKeyRem, PrivateKeyEth, AccountNameRem, OwnerKeyRem, ActiveKeyRem} = this.state;
    return (
      <div className="steps-wrap">

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

        <div className="steps-action">
          { current > 0 && current < 2 && ( <Button type="primary" onClick={() => this.prev()}> <Icon type="left" /> Back </Button> ) }
        </div>

      </div>
    )
  }
}

export default CreateSteps;
