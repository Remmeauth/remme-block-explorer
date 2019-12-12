import './style.css';

import React, { Component } from "react";
import {message, Row, Col, Button, Icon} from 'antd';

import { EthIsMetamask, EthMetamaskNetwork } from '../../../functions/swap';
import metamask from "../../../assets/metamask.png"
import {MetamaskNetworkConfig} from "../../../config.js";
import CreateForm from "../../CreateForm";
import {ethAddress} from "../../../schemes";

class StepEthWallet extends Component {

  handleEthAddress = async () => {
    const { onSubmit } = this.props;
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) { return; }
      onSubmit({
        PrivateKeyEth: values.eth_address,
        current: 2
      });
    });
  };

  handleMetamask = async () => {
    const { onSubmit } = this.props;
    const isMetamask = await EthIsMetamask();
    const currentMetamaskNetwork = EthMetamaskNetwork();
    if (isMetamask && currentMetamaskNetwork === MetamaskNetworkConfig.index) {
      onSubmit({ PrivateKeyEth: "metamask" });
    } else if (isMetamask && currentMetamaskNetwork !== MetamaskNetworkConfig.index) {
      message.error("Metamask network must be: " + MetamaskNetworkConfig.name, 2);
    } else {
      message.error("Metamask not found. Check and try again.", 2);
    }
  };

  render() {
    const { onSubmit, type } = this.props;
    return (
      <React.Fragment>
          <div className="align-center">
            <h5 className="step-title">{!type ? "Select" : "Enter"} your <b>Ethrereum</b> wallet:</h5>
            <Row gutter={16} type="flex" justify="center">
                {
                  type === 1 &&
                  <Col className="gutter-row" span={18}>
                    <CreateForm className={"eth-address"} scheme={ethAddress} ref={form => this.form = form} onSubmit={this.handleEthAddress}/>
                    <Button onClick={() => onSubmit({current: 0})}> <Icon type="left"/> Back</Button>
                    <Button type="primary" onClick={this.handleEthAddress}>Next</Button>
                  </Col>
                }
                {
                  type === 0 &&
                  <Col className="gutter-row" span={12}>
                    <div className="select-metamask color-background" onClick={this.handleMetamask}>
                      <img src={metamask} alt=""/>
                      <p>MetaMask</p></div>
                    <br/>
                    <div className="steps-action">
                      <Button onClick={() => onSubmit({current: 0})}> <Icon type="left"/> Back</Button>
                    </div>
                  </Col>
                }
            </Row>
          </div>
      </React.Fragment>
    )
  }
}

export default StepEthWallet;
