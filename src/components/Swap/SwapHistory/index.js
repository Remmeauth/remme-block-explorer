import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import PropTypes from "prop-types";
import { Steps, Modal } from 'antd';

import { taskList, doSwapTask } from '../../../functions/swap';
import { start, logout, cancel, login } from "../../../actions";
import { ethTransaction } from '../../../schemes';
import { CreateForm } from '../../../components'
import { availableSwaps, updateStore, cancelSwap } from '../../../functions/helpers'
import './style.css'

import BlockexplorerLink from "../BlockexplorerLink"

const Step = Steps.Step;

class SwapHistory extends Component {

  state = {
    clickedMetamask: false,
    initiated: 1,
    current: 0,
    currentStatus: "process",
    taksStatus: {},
    visible: false
  }

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleOk = e => {
    const form = this.form;
    const { index } = this.state
    form.validateFields((err, values) => {
      if (err) { return; }
      form.resetFields();
      const ls = JSON.parse(localStorage.getItem('swap'));
      const date = Date.now();
      if (index === 5) {
        this.updateLocalStorage({
          SwapTransaction: values.eth_address,
          [date]: "SwapTransactionChange: " + ls.SwapTransaction + " --> " + values.eth_address
        });
      } else if (index === 2) {
        this.updateLocalStorage({
          SwapTransactionApprove: values.eth_address,
          [date]: "SwapTransactionApproveChange: " + ls.SwapTransactionApprove + " --> " + values.eth_address
        });
      }
      window.location.reload(false);
    });
  };

  showModal = (index) => {
    this.setState({
      visible: true,
      index: index
    });
  };

  updateLocalStorage = ( data ) => {
    let { start } = this.props;
    let ls = localStorage.getItem('swap');
    ls = ls ? JSON.parse(ls) : false
    const updatedParams = {
      ...ls,
      ...data
    }
    localStorage.setItem('swap', JSON.stringify(updatedParams));
    start(updatedParams);
  }

  taskCallback = (error, responce) => {
    let { current, taksStatus } = this.state ;

    const { type } = this.props
      if (error) {
        taksStatus[current] = error;
        this.setState({
          taksStatus,
          currentStatus: "error"
        });
      } else if (responce) {
        this.setState({ clickedMetamask: false });
        taksStatus[current] = responce;
        this.updateLocalStorage({[taskList[type][current].id]: responce});
        this.setState({
          taksStatus,
          current: current + 1
        }, () => {
          if (current < taskList[type].length - 1) {
            this.next();
          } else {
            this.setState({currentStatus: "done"});
          }
        });
      } else {
        taksStatus[current] = "process ...";
        this.setState({ taksStatus });
        setTimeout(() => { this.next(); }, 10000);
      }
  }

  beforeDoSwapTask = () => {
    const { current } = this.state;
    const { start, logout, cancel } = this.props;

    if (availableSwaps()) {
      updateStore(start, login);
      setTimeout(()=>{
        doSwapTask( current, this.props, this.taskCallback );
      }, 100);
    } else {
      cancelSwap(logout, cancel);
      this.setState({ initiated: false });
    }
  }

  next = async () => {
    const { current, clickedMetamask } = this.state;
    const { id } = taskList[this.props.type][current];

    if ( clickedMetamask || (current !== 2 && current !== 5)) {
      this.beforeDoSwapTask();
    } else if (this.props[id]) {
      this.taskCallback(null, this.props[id]);
    } else if (availableSwaps(this.props.logout, this.props.cancel)) {
      updateStore(this.props.start, this.props.login);
      setTimeout(()=>{ this.next() }, 2000);
    } else {
      this.setState({ initiated: false });
    }
  }

  componentDidMount = () => {
    this.next();
  }

  handler = (i, e) => {
    let { current } = this.state;
    if ((e.shiftKey && i === 5) || (e.shiftKey && i === 2)) {
      this.showModal(i);
    } else if ((i === 2 && current === 2) || (i === 5 && current === 5)) {
      this.setState({ clickedMetamask: true });
    }
  }

  render() {
    const { type, amount, SwapFinalize, addressEth } = this.props
    const { current, taksStatus, currentStatus, initiated, clickedMetamask } = this.state
    return (
      <React.Fragment>
        { !initiated && <Redirect to="/init-swap" /> }
        <Modal
          title="Change Tx Id:"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <CreateForm scheme={ethTransaction} ref={form => this.form = form} onSubmit={this.handleOk}/>
        </Modal>
        <div className={`loader ${currentStatus}`}></div>
        <Steps className={'current-' + current} size="small" direction="vertical" current={current} status={currentStatus}>
          { taskList[type].map((item, index) => <Step
            className={item.id + ' ' + (!clickedMetamask ? 'button-not-clicked' : '')}
            onClick={this.handler.bind(this, index)}
            data-index={index} key={index}
            title={item.title}
            description={taksStatus[index]}
          />) }
        </Steps>
         { currentStatus === "done" &&
          <div className="success-block align-center">
            <h4 className="status-success">Success!</h4>
            <h6>
              <BlockexplorerLink tx={ type ? addressEth : SwapFinalize} type={type} amount={amount} />
            </h6>
          </div>
         }
      </React.Fragment>
    )
  }
}

SwapHistory.propTypes = {
  SwapInitiated: PropTypes.bool.isRequired,
  PrivateKeyRem: PropTypes.string.isRequired,
  PrivateKeyEth: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  addressEth: PropTypes.string.isRequired,
  addressRem: PropTypes.string.isRequired,
  balanceRemRem: PropTypes.number.isRequired,
  balanceEthRem: PropTypes.number.isRequired,
  balanceEthEth: PropTypes.string.isRequired,
};

//----------------------------------------------------------------------------------------------------------------------

function mapStateToProps(state) {
  return {
    SwapInitiated: state.auth.SwapInitiated,
    PrivateKeyRem: state.auth.PrivateKeyRem,
    PrivateKeyEth: state.auth.PrivateKeyEth,
    AccountNameRem: state.auth.AccountNameRem,
    ActiveKeyRem: state.auth.ActiveKeyRem,
    OwnerKeyRem: state.auth.OwnerKeyRem,
    amount: state.auth.amount,
    type: state.auth.type,
    addressEth: state.auth.addressEth,
    addressRem: state.auth.addressRem,
    balanceRemRem: state.auth.balanceRemRem,
    balanceEthRem: state.auth.balanceEthRem,
    balanceEthEth: state.auth.balanceEthEth,
    SwapSecret: state.swap.SwapSecret,
    SwapRawTransaction: state.swap.SwapRawTransaction,
    SwapRawTransactionApprove: state.swap.SwapRawTransactionApprove,
    SwapTransactionApprove: state.swap.SwapTransactionApprove,
    SwapTransaction: state.swap.SwapTransaction,
    SwapTransactionApproveStatus: state.swap.SwapTransactionApproveStatus,
    SwapTransactionStatus: state.swap.SwapTransactionStatus,
    SwapSignDigest:state.swap.SwapSignDigest,
    SwapID:state.swap.SwapID,
    SwapWait:state.swap.SwapWait,
    SwapFinalize: state.swap.SwapFinalize,
  };
};

//----------------------------------------------------------------------------------------------------------------------

export default connect(mapStateToProps, { start, logout, cancel, login })(SwapHistory);
