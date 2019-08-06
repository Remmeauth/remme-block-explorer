import './style.css';

import React, { Component } from "react";
import { Row, Col, Icon, Skeleton } from 'antd';

import ethLogo from "../../../assets/eth_logo.png"
import remLogo from "../../../assets/rem_logo.png"


const CoinInfo = ({ dir, coin, address, balance1, balance2 }) => (
  <Col span={10}>
    <img src={coin ? remLogo :ethLogo } alt="Logo" />
    { address ?
      !coin ?
        (<p className="address"> {address.slice(0, 12)}...{address.slice(-12)}</p>) :
        (<p className="address">{address}</p> )
      : <Skeleton paragraph={false} active /> }
    <div className="balance">
      <p><b>REM Balance</b>: {balance1}</p>
      {!coin && (<p><b>ETH Balance</b>: {balance2}</p>)}
    </div>
  </Col>
);

class SwapParamsView extends Component {

  render() {
    const { type, addressEth, addressRem, balanceRemRem, balanceEthEth, balanceEthRem } = this.props;
    return (
      <React.Fragment>
        <Row gutter={16}>
          <Col span={24}><p>Swap params:</p></Col>
        </Row>
        <Row gutter={16}>
          { type ?
            <CoinInfo dir={0} coin={1} address={addressRem} balance1={balanceRemRem} /> :
            <CoinInfo dir={0} coin={0} address={addressEth} balance1={balanceEthRem} balance2={balanceEthEth} />
          }
          <Col span={4}>
            <Icon type="right" />
          </Col>
          { type ?
            <CoinInfo dir={1} coin={0} address={addressEth} balance1={balanceEthRem} balance2={balanceEthEth} /> :
            <CoinInfo dir={1} coin={1} address={addressRem} balance1={balanceRemRem} />
          }
        </Row>
      </React.Fragment>
    )
  }
}

export default SwapParamsView;
