import React, { Component } from 'react';
import { Row, Col, Button, message, Card, Tabs } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';
import {JsonRpc, Api} from 'eosjs';
import queryString from 'query-string';

import { fetchBackend } from '../../functions/helpers'
import { RemmeSpin, RemmeResult, RemmeAccountInfo, RemmeResourcesInfo, CreateForm, TagsField, RemmeAccountTxInfo } from '../../components'
import { walletTransfer, walletStake, walletUnstake } from '../../schemes';
import scatter from "../../assets/scatter.jpg";

const { TabPane } = Tabs;

ScatterJS.plugins(new ScatterEOS());
const net = ScatterJS.Network.fromJson({
    blockchain: process.env.REACT_APP_NETWORK_BLOCKCHAIN,
    chainId: process.env.REACT_APP_NETWORK_CHAIN_ID,
    host: process.env.REACT_APP_NETWORK_HOST,
    port: process.env.REACT_APP_NETWORK_PORT,
    protocol: process.env.REACT_APP_NETWORK_PROTOCOL
});

const rpc = new JsonRpc(net.fullhost());
const eos = ScatterJS.eos(net, Api, {rpc});

class Wallet extends Component {

  state = {
    producers: [],
    defaultActiveKey: "stake",
    loading: false,
  }

  componentDidMount() {
    const search = queryString.parse(this.props.location.search, {arrayFormat: 'comma'});
    this.setState({
      producers: search.producers ? search.producers : [],
      defaultActiveKey: search.tab ? search.tab : "stake"
    });
  }

  voteProducers = (tags) => {
    this.setState({ producers: tags });
  }

  initTransaction = (prefix, action_name, data) => {
    const {authority, name} = this.state;
    eos.transact({
        actions: [{
            account: `${process.env.REACT_APP_SYSTEM_ACCOUNT}${prefix}`,
            name: action_name,
            authorization: [{
                actor: name,
                permission: authority,
            }],
            data: data
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    }).then(res => {
        console.log('sent: ', res);
      message.success('Transaction Success', 2);
      setTimeout(() => {
        this.handleAccountInfo(name, authority);
      }, 2000);

    }).catch(err => {
      message.error(err.message, 10);
    });
  }

  handleTransaction = (e) => {
    const {name} = this.state;
    const form = this.form1;
    form.validateFields((err, values) => {
      if (err) { return; }
      const data = {
          from: name,
          to: values.account_name,
          quantity: `${Number(values.amount).toFixed(4)} ${process.env.REACT_APP_SYSTEM_COIN}`,
          memo: values.memo,
      }
      form.resetFields();
      this.initTransaction('.token', 'transfer', data);
    });
  };

  handleVote = () => {
    const {producers, name} = this.state;

    if (!producers || producers.length === 0) {
      message.error('Pls. Set producers.', 4);
      return;
    }
    const data = {
        voter: name,
        proxy: '',
        producers: producers.sort()
    }
    this.setState({ producers: [] });
    this.initTransaction('', 'voteproducer', data);
  }

  handleStake = (e) => {
    const {name} = this.state;
    const form = this.form2;
    form.validateFields((err, values) => {
      if (err) { return; }
      const data = {
          from: name,
          receiver: name,
          stake_quantity: `${Number(values.amount).toFixed(4)} ${process.env.REACT_APP_SYSTEM_COIN}`,
          transfer: false,
      }
      form.resetFields();
      this.initTransaction('','delegatebw', data);
    });
  };

  handleInitUnstake = (e) => {
    const {name} = this.state;
    const form = this.form3;
    form.validateFields((err, values) => {
      if (err) { return; }
      const data = {
          from: name,
          receiver: name,
          unstake_quantity: `${Number(values.amount).toFixed(4)} ${process.env.REACT_APP_SYSTEM_COIN}`,
          transfer: false,
      }
      form.resetFields();
      this.initTransaction('','undelegatebw', data);
    });
  };

  handleUnstake = (e) => {
    const form = this.form4;
    form.validateFields((err, values) => {
      if (err) { return; }
      const data = {
          owner: values.owner,
      }
      form.resetFields();
      this.initTransaction('','refund', data);
    });
  };

  handleClaim = (e) => {
    const {name} = this.state;
    const data = {
        owner: name,
    }
    this.initTransaction('','claimrewards', data);
  };

  handleAccountInfo = async (name,authority) => {
    this.setState({ loading: true });
    try {
      const json = await fetchBackend('getAccount', name);
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
          authority: authority
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

  logout = () =>  {
    ScatterJS.scatter.forgetIdentity();
    ScatterJS.scatter.logout();
    window.location.reload(false);
  }

  login = async () => {
      try {
          await ScatterJS.connect(process.env.REACT_APP_SYSTEM_ACCOUNT, {net});
          await ScatterJS.logout();
      } catch (e) {
          message.error("Connection error. Please restart your Scatter client.", 10);
          return false;
      }

      try {
          const login = await ScatterJS.login({accounts: [net]});
          const account = await ScatterJS.account(process.env.REACT_APP_NETWORK_BLOCKCHAIN);
          if (!account) {
              message.error('No accounts', 4);
              return false;
          }
          this.handleAccountInfo(account.name, account.authority);
      } catch (e) {
          if (e.message) {
            message.error(e.message, 10);
          } else {
            message.error('No accounts', 10);
          }
          return false;
      }
  }

  render() {
    const { raw, loading, error, producers, defaultActiveKey } = this.state;
    const IE = /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent);
    return (
      <React.Fragment>
        { loading ? (<RemmeSpin/>) :
            error ? (<RemmeResult error={error} />) :
              raw ? (
                <React.Fragment>
                  <QueueAnim delay={300} interval={300} type="right" component={Row} gutter={30}>
                    <Col key="1">
                      <h4>Web Wallet:</h4>
                      <Card className="card-with-padding align-center" >
                        <Tabs defaultActiveKey={defaultActiveKey}>
                          <TabPane tab="Stake Resources" key="stake">
                            <h5>Stake:</h5>
                            <CreateForm scheme={walletStake} ref={form => this.form2 = form}/>
                            <Button type="primary" onClick={this.handleStake}>Generate Transaction</Button>
                          </TabPane>
                          <TabPane tab="Unstake Resources" key="unstake">
                            <h5>Unstake:</h5>
                            <CreateForm scheme={walletStake} ref={form => this.form3 = form}/>
                            <Button type="primary" onClick={this.handleInitUnstake}>Initiate Unstake</Button>
                            <br/>
                            <br/>
                            <CreateForm scheme={walletUnstake} ref={form => this.form4 = form}/>
                            <Button type="primary" onClick={this.handleUnstake}>Claim Unfrozen Stake</Button>
                          </TabPane>
                          <TabPane tab="Vote" key="vote">
                            <h5>Vote:</h5>
                            <div className="form-wit-tags-field">
                              <p>Add producers:</p>
                              <TagsField onUpdate={this.voteProducers} tags={producers}/>
                            </div>
                            <Button type="primary" onClick={this.handleVote}>Generate Transaction</Button>
                          </TabPane>
                          <TabPane tab="Claim Reward" key="claim">
                            <h5>Claim:</h5>
                            <Button type="primary" onClick={this.handleClaim}>Generate Transaction</Button>
                          </TabPane>
                          <TabPane tab="Token transfer" key="transfer">
                            <h5>Transfer Tokens:</h5>
                            <CreateForm scheme={walletTransfer} ref={form => this.form1 = form}/>
                            <Button type="primary" onClick={this.handleTransaction}>Generate Transaction</Button>
                          </TabPane>
                        </Tabs>

                      </Card>
                    </Col>
                  </QueueAnim>
                  <QueueAnim delay={900} interval={300} type="right" component={Row} gutter={30}>
                    <Col lg={24} xl={12} key="1">
                      <RemmeAccountInfo data={raw} forceUpdate={()=>{}}/>
                    </Col>
                    <Col lg={24} xl={12} key="2">
                      <RemmeResourcesInfo data={raw}/>
                    </Col>
                    <Col lg={24} xl={24} key="3">
                      <h4>Actions:</h4>
                      <RemmeAccountTxInfo id={raw.account.account_name}/>
                    </Col>
                  </QueueAnim>
                  <QueueAnim delay={1500} interval={300} type="right" component={Row} gutter={30}>
                    <Col lg={24} xl={24} key="1" className="align-center">
                      <Button type="primary" onClick={this.logout}>Logout</Button>
                    </Col>
                  </QueueAnim>
                </React.Fragment>
              ) : (
                <QueueAnim delay={300} interval={300} type="right" component={Row} gutter={30}>
                  <Col className="align-center" key="1">
                    <Card className="card-with-padding" >
                      <h4>WEB Wallet</h4>
                      <p>Unlock wallet to start:</p>
                      { IE ? <h5 className="step-title">Your browser is not supported.<br/>We recommend using Chrome, Firefox or Safari.</h5> : <img className="image-button" onClick={this.login} src={scatter} alt=""/> }
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
