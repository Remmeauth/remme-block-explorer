import './style.css';

import React, { Component } from "react";
import { Button, Spin, message, Icon } from 'antd';
import { connect } from "react-redux";
import jwt from "jsonwebtoken";
import { amount } from '../../../schemes';
import CreateForm from '../../CreateForm';
import { login } from "../../../actions";
import { secret, network, decimal } from "../../../config";

import { EthPrivateKeyToAddress, RemGetBalanceRem, EthGetBalanceRem, EthGetBalanceEth, RemGetAccountCreatingFee, RemGetSwapFee } from '../../../functions/swap';
import SwapParamsView from "../SwapParamsView"


class StepInitiate extends Component {

  state = {
    loading: true,
    type: this.props.type,
    PrivateKeyRem: this.props.PrivateKeyRem,
    PrivateKeyEth: this.props.PrivateKeyEth,
    AccountNameRem: this.props.AccountNameRem,
    OwnerKeyRem: this.props.OwnerKeyRem,
    ActiveKeyRem: this.props.ActiveKeyRem,
  };

  initSwap = async (data) => {
    const { login } = this.props;
    localStorage.setItem('token', jwt.sign(data, secret));
    login(data);
  }

  handleSubmit = (e) => {
    const { type, addressEth, addressRem, balanceRemRem, balanceEthRem, balanceEthEth, PrivateKeyRem, PrivateKeyEth, AccountNameRem, OwnerKeyRem, ActiveKeyRem } = this.state
    const form = this.form;

    form.validateFields((err, values) => {
      if (err) { return; }
      const SwapData = {
        SwapInitiated: true,
        amount: values.amount,
        accountCreatingFee: 0,
        PrivateKeyEth,
        PrivateKeyRem,
        AccountNameRem,
        OwnerKeyRem,
        ActiveKeyRem,
        type,
        addressEth,
        addressRem,
        balanceRemRem,
        balanceEthRem,
        balanceEthEth,
      }
      this.initSwap(SwapData);
    });
  };

  amountValidator = (item, value, callback) => {
    const { type, balanceRemRem, balanceEthRem, accountCreatingFee, swapFee } = this.state

    this.setState({ willGet: value });

    const remBalance = type ? balanceRemRem : balanceEthRem
    const minDeposit = accountCreatingFee + swapFee + 1

    if (isNaN(parseFloat(value)) && !isFinite(value)) {
      callback("Please enter a valid number!");
    }
    if (parseFloat(value) < minDeposit) {
      callback("Min swap is "+minDeposit+" REM.");
    }
    if (parseFloat(value) > remBalance) {
      callback( `You have only ${remBalance} REM.` );
    }
    callback();
  };

  updateParams = async () => {
    const { PrivateKeyEth, AccountNameRem, type } = this.state
    try {
      this.setState({ loading: true });

      const addressEth = await EthPrivateKeyToAddress(PrivateKeyEth);
      const addressRem = AccountNameRem;

      const balanceEthRem = await EthGetBalanceRem(addressEth);
      const balanceEthEth = await EthGetBalanceEth(addressEth);

      const balanceRemRem = await RemGetBalanceRem(addressRem);

      const accountCreatingFee = await RemGetAccountCreatingFee();
      const swapFeeInfo = await RemGetSwapFee();
      console.log(swapFeeInfo);
      const swapFee = (type ? swapFeeInfo[0].out_swap_min_amount : swapFeeInfo[0].in_swap_min_amount) / decimal

      this.setState({
        accountCreatingFee,
        swapFee: swapFee,
        addressEth,
        addressRem,
        balanceRemRem,
        balanceEthRem,
        balanceEthEth,
        loading: false
      });
    } catch (e) {
      console.log(e);
      message.error("Something went wrong. Please try again.", 2);
    }
  }

  accountOnChange = (update) => {
    this.sub = window.ethereum.on('accountsChanged', function (accounts) {
      update();
    })
  }

  componentDidMount = async () => {
    const { PrivateKeyEth } = this.state
    PrivateKeyEth === "metamask" && this.accountOnChange(this.updateParams);
    this.updateParams();
  }

  render() {
    const { onSubmit } = this.props;
    const { type, addressEth, addressRem, balanceRemRem, balanceEthRem, balanceEthEth, swapFee, OwnerKeyRem, accountCreatingFee, willGet } = this.state
    const minimalAmountToSwap = accountCreatingFee + swapFee + 1


    const userWillGet = OwnerKeyRem ? (willGet - minimalAmountToSwap + 1) : (willGet - swapFee)
    const userWillGetAmount = willGet >= Number(minimalAmountToSwap) ? userWillGet : false

    const scheme = amount({ amountValidator: this.amountValidator });
    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          <div className="swap-initiate-section">
            <SwapParamsView type={type} addressEth={addressEth} addressRem={addressRem} balanceRemRem={balanceRemRem} balanceEthRem={balanceEthRem} balanceEthEth={balanceEthEth}/>
          </div>
          <h6>Commission will be charged:</h6>
          <p className="small">Swap action: <span className="amount-color">{swapFee} {network.coin}</span>
            { OwnerKeyRem && <React.Fragment><br/>Account creation action: <span className="amount-color">{accountCreatingFee} {network.coin}</span></React.Fragment> }
          </p>
          <h6>Tokens to swap:</h6>
          <CreateForm
            scheme={scheme}
            className="amount-form"
            ref={form => this.form = form}
            onSubmit={this.handleSubmit}
          />
          <p className="small">Minimal amount for swap: <span className="amount-color">{minimalAmountToSwap} {network.coin}</span>
            {userWillGetAmount && <React.Fragment><br/>You will get: <span className="amount-color">{userWillGetAmount} {network.coin}</span></React.Fragment>}
          </p>
          <Button onClick={() => onSubmit({ current:2 })}> <Icon type="left" /> Back</Button>
          <Button className="init-swap" onClick={this.handleSubmit}>Init Swap</Button>
        </Spin>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    SwapInitiated: state.auth.SwapInitiated,
  }
};

export default connect(mapStateToProps, { login })(StepInitiate);
