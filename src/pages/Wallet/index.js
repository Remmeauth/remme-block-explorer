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
    form.validateFields((err, values) => {
      if (err) { return; }
      //try {
        console.log(values);
        console.log(name, values.account_name, Number(`${values.amount}`).toFixed(4) + ` ${network.coin}`, values.memo, authorization);

        this.eos.transfer(name, 'helloworld', '0.0001 EOS', 'memo', authorization).then(trx => {
            console.log(`Transaction ID: ${trx.transaction_id}`);
        }).catch(error => {
            console.error(error);
        });
      // } catch (e) {
      //  message.error("Data is wrong. Try again.", 2);
      // }
    });
  };

  handleAccountInfo = async (name,authority) => {
    this.setState({ loading: true });
    try {
      const response = await fetch(`${network.backendAddress}/api/getAccount/${name}`);
      const json = await response.json();
      console.log(json);
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
            console.log("START");
            console.log(network);
            console.log(Eos);
            console.log(eosOptions);
            const eos = ScatterJS.scatter.eos(network, Eos, eosOptions);
            const transactionOptions = { authorization:[`${objectIdentity.name}@${objectIdentity.authority}`] };

            eos.transfer(objectIdentity.name, 'helloworld', '0.0001 EOS', 'memo', transactionOptions).then(trx => {
            // That's it!
                console.log(`Transaction ID: ${trx.transaction_id}`);
            }).catch(error => {
                console.error(error);
            });

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
    console.log(this.state);
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
                    <h4>WEB Wallet</h4>
                    <p>Unlock wallet to start:</p>
                    <img className="image-button" onClick={this.login} src={scatter} alt=""/>
                  </Col>
                </QueueAnim>
              )
        }
      </React.Fragment>
    );
  }
}

export default Wallet;
