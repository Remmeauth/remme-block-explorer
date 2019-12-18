import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Steps, Modal } from 'antd';

import { taskList, doSwapTask } from '../../../functions/swap';
import { start } from "../../../actions";

import BlockexplorerLink from "../BlockexplorerLink"

const Step = Steps.Step;

class SwapHistory extends Component {

  state = {
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
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
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

  next = async () => {
    const { current } = this.state;
    doSwapTask( current, this.props, this.taskCallback );
  }

  componentDidMount = () => {
    this.next();
  }

  setApprove = () => {

  }

  handler = (i, e) => {
    e.shiftKey && e.ctrlKey && i === 2 && this.showModal();
  }

  render() {
    const { type, amount, SwapFinalize, addressEth } = this.props
    const { current, taksStatus, currentStatus } = this.state
    return (
      <React.Fragment>
        <Modal
          title="Change"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
        </Modal>
        <div className={`loader ${currentStatus}`}></div>
        <Steps size="small" direction="vertical" current={current} status={currentStatus}>
          { taskList[type].map((item, index) => <Step onClick={this.handler.bind(this, index)} data-index={index} key={index} title={item.title} description={taksStatus[index]} />) }
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
    SwapFinalize: state.swap.SwapFinalize
  };
};

//----------------------------------------------------------------------------------------------------------------------

export default connect(mapStateToProps, { start })(SwapHistory);
