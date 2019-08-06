import './style.css';

import React, { Component } from "react";
import { message, Row, Col } from 'antd';

import { EthIsMetamask, EthMetamaskNetwork } from '../../../functions/swap';
import metamask from "../../../assets/metamask.png"
import {MetamaskNetworkConfig} from "../../../config.js";

class StepEthWallet extends Component {

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
    return (
      <React.Fragment>
          <div className="align-center">
            <h5 className="step-title">Select your <b>Ethrereum</b> wallet:</h5>
            <Row gutter={16} type="flex" justify="center">
              <Col className="gutter-row" span={12}>
                <div className="select-metamask color-background" onClick={this.handleMetamask}><img src={metamask} alt=""/><p>MetaMask</p></div>
              </Col>
            </Row>
          </div>
      </React.Fragment>
    )
  }
}

export default StepEthWallet;
