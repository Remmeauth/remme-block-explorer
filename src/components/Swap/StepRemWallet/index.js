import React, { Component } from "react";
import {message, Button, Icon, Card} from 'antd';

import CreateForm from '../../CreateForm';
import { existingAccount, newAccount } from '../../../schemes';
import { network } from '../../../config'
import scatter from "../../../assets/scatter.jpg";
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';

ScatterJS.plugins( new ScatterEOS() );
const net = ScatterJS.Network.fromJson(network);


class StepRemWallet extends Component {
  state = {
    choice: false,
  };

  handleExistingAccount = async (e) => {
    const { onSubmit } = this.props;
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) { return; }
      try {
        fetch(`${network.backendAddress}/api/getAccount/${values.account_name}`).then(res => res.json()).then(json =>{
          console.log(json);
          if (!json.account) {
            message.error("Account not found.", 2);
          } else {
            onSubmit({
              PrivateKeyRem: 'scatter',
              AccountNameRem: values.account_name,
              OwnerKeyRem: "",
              ActiveKeyRem: ""
            });
          }
        });
      } catch (e) {
       message.error("Data is wrong. Try again.", 2);
      }
    });
  };

  handleNewAccount = (e) => {
    const { onSubmit } = this.props;
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) { return; }
      try {
        fetch(`${network.backendAddress}/api/getAccount/${values.account_name}`).then(res => res.json()).then(json =>{
          if (json.account) {
            message.error("Account already exist.", 2);
          } else {
            onSubmit({
              PrivateKeyRem: 'scatter',
              AccountNameRem: values.account_name,
              OwnerKeyRem: values.owner_key,
              ActiveKeyRem: values.active_key
            });
          }
        });
      } catch (e) {
       message.error("Data is wrong. Try again.", 2);
      }
    });
  };

  connect = async () => {
    const {onSubmit} = this.props;
    const connected = await ScatterJS.connect(network.account, {net});
    if (!connected) {
      return false;
    }

    await ScatterJS.logout();

    const login = await ScatterJS.login({accounts: [net]});
    if (!login) return console.error('no identity');

    const account = await ScatterJS.account(network.blockchain);

    if (!account) {
      message.error('No accounts');
      return false;
    }

    try {
      const res = await fetch(`${network.backendAddress}/api/getAccount/${account.name}`);
      const json = await res.json();
      if (!json.account) {
        message.error("Account not found.", 2);
        return false;
      }
      onSubmit({
        PrivateKeyRem: 'scatter',
        AccountNameRem: account.name,
        OwnerKeyRem: "",
        ActiveKeyRem: ""
      });
    } catch (e) {
      message.error("Data is wrong. Try again.", 2);
    }
  }

  render() {
    const { choice } = this.state;
    const { onSubmit, type } = this.props;
    return (
      <React.Fragment>
          <div className="align-center">
            <h5>{type ? "Select" : "Enter"} your Remme account for Swap:</h5>
            {
              type === 1 &&
              <React.Fragment>
                <div>
                  <img className="image-button" onClick={this.connect} src={scatter} alt=""/>
                </div>
                <Button onClick={() => onSubmit({current: 1})} style={{marginTop: "20px"}}> <Icon type="left"/> Back</Button>
              </React.Fragment>
            }
            {
              type === 0 &&
              <React.Fragment>
                { !choice &&
                <React.Fragment>
                  <div>
                    <Button onClick={()=>{this.setState({choice: 'new'})}} type="primary">Create New</Button>
                    <Button onClick={()=>{this.setState({choice: 'existing'})}} type="primary">Choose existing</Button>
                  </div>
                  <Button onClick={() => onSubmit({current: 1})} style={{marginTop: "20px"}}> <Icon type="left"/> Back</Button>
                </React.Fragment>
                }

                { choice === 'new' &&
                <React.Fragment>
                  <CreateForm scheme={newAccount} ref={form => this.form = form}/>
                  <Button onClick={() => onSubmit({ current:1 })}> <Icon type="left" /> Back</Button>
                  <Button type="primary" onClick={this.handleNewAccount}>Next</Button>
                </React.Fragment>
                }

                { choice === 'existing' &&
                <React.Fragment>
                  <CreateForm scheme={existingAccount} ref={form => this.form = form}/>
                  <Button onClick={() => onSubmit({ current:1 })}> <Icon type="left" /> Back</Button>
                  <Button type="primary" onClick={this.handleExistingAccount}>Next</Button>
                </React.Fragment>
                }
              </React.Fragment>
            }
          </div>
      </React.Fragment>
    )
  }
}

export default StepRemWallet;
