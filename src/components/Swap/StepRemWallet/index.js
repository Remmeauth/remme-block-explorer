import React, { Component } from "react";
import { message, Button, Icon } from 'antd';

import CreateForm from '../../CreateForm';
import { existingAccount, newAccount } from '../../../schemes';
import { network } from '../../../config'


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
          console.log(json);
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

  render() {
    const { choice } = this.state;
    const { onSubmit } = this.props;
    return (
      <React.Fragment>
          <div className="align-center">
            <h5>Enter your Remme account for Swap:</h5>
            { !choice &&
              <React.Fragment>
                <Button onClick={()=>{this.setState({choice: 'new'})}} type="primary">Create New</Button>
                <Button onClick={()=>{this.setState({choice: 'existing'})}} type="primary">Choose existing</Button>
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
          </div>
      </React.Fragment>
    )
  }
}

export default StepRemWallet;
