import React, { Component } from 'react';
import { Row, Col, Button, message, Card } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';

import { network } from '../../config.js'
import { RemmeSpin, RemmeResult, RemmeAccountInfo, RemmeResourcesInfo, CreateForm } from '../../components'
import { walletTransfer } from '../../schemes';
import scatter from "../../assets/scatter.jpg"

ScatterJS.plugins( new ScatterEOS() );

const eosOptions = { expireInSeconds:60 };

class Wallet extends Component {

  state = {
    loading: false,
  }

  handleTransaction = (e) => {
    const {authorization, name} = this.state;
    const form = this.form;
    try {
      form.validateFields((err, values) => {
        if (err) { return; }
        const eos = ScatterJS.scatter.eos(network, Eos, eosOptions);
        eos.transfer(name, values.account_name, Number(`${values.amount}`).toFixed(4) + ` ${network.coin}`, values.memo, authorization).then(trx => {
            message.success('Transaction Success, Please check your account page', 2);
            console.log(`Transaction ID: ${trx.transaction_id}`);
        }).catch(error => {
            message.error('Transaction Fail', 2);
        });
      });
    } catch (e) {
      console.log(e);
    } finally {
      form.resetFields();
    }
  };

  handleAccountInfo = async (name,authority) => {
    this.setState({ loading: true });
    try {
      const response = await fetch(`${network.backendAddress}/api/getAccount/${name}`);
      const json = await response.json();
      if (!json.account.account_name) {
        this.setState({
          error: "Account not found",
          loading: false
        });
      } else {
        this.setState({
          error: false,
          loading: false,
          raw: json,
          name: name,
          authorization: { authorization:[`${name}@${authority}`] }
        });
      }
    } catch (error) {
      console.log(error.message);
      this.setState({
        error: "Account not found",
        loading: false
      });
    }
  }

  logout = () => {
    this.setState({ account: false, raw: false });
    ScatterJS.scatter.logout();
  }

  login = () => {
    ScatterJS.scatter.connect(network.blockchain).then(connected => {
      if(!connected) { message.error("Can't connect to Scatter"); return false; }
      ScatterJS.getIdentity({ accounts: [network]}).then(identity => {
          let objectIdentity;
          if (identity.accounts.length === 0) return;
          if (ScatterJS.identity && ScatterJS.identity.accounts) objectIdentity = ScatterJS.identity.accounts.find(x => x.blockchain === network.blockchain);
          if (objectIdentity) {
            this.handleAccountInfo(objectIdentity.name, objectIdentity.authority);
          }
      }).catch(err => {
          message.error(err.message);
          console.error(err.message);
      });
    });
  }

  render() {
    const { raw, loading, error } = this.state;
    return (
      <React.Fragment>
        { loading ? (<RemmeSpin/>) :
            error ? (<RemmeResult error={error} />) :
              raw ? (
                <React.Fragment>
                  <QueueAnim delay={300} interval={300} type="right" component={Row} gutter={30}>
                    <Col lg={24} xl={12} key="1">
                      <RemmeAccountInfo data={raw} forceUpdate={()=>{}}/>
                    </Col>
                    <Col lg={24} xl={12} key="2">
                      <RemmeResourcesInfo data={raw}/>
                    </Col>
                  </QueueAnim>
                  <QueueAnim delay={900} interval={300} type="right" component={Row} gutter={30}>
                    <Col className="align-center" key="1">
                      <Card className="card-with-padding" >
                        <h4>Transfer Tokens:</h4>
                        <CreateForm scheme={walletTransfer} ref={form => this.form = form}/>
                        <Button type="primary" onClick={this.handleTransaction}>Generate Transaction</Button>
                        <Button type="primary" onClick={this.logout}>Logout</Button>
                      </Card>
                    </Col>
                  </QueueAnim>
                </React.Fragment>
              ) : (
                <QueueAnim delay={300} interval={300} type="right" component={Row} gutter={30}>
                  <Col className="align-center" key="1">
                    <Card className="card-with-padding" >
                      <h4>WEB Wallet</h4>
                      <p>Unlock wallet to start:</p>
                      <img className="image-button" onClick={this.login} src={scatter} alt=""/>
                    </Card>
                  </Col>
                </QueueAnim>
              )
        }
      </React.Fragment>
    );
  }
}

export default Wallet;
