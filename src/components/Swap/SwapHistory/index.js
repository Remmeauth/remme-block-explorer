import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Steps } from 'antd';

import { taskList, doSwapTask } from '../../../functions/swap';
import { start } from "../../../actions";

import BlockexplorerLink from "../BlockexplorerLink"

const Step = Steps.Step;

class SwapHistory extends Component {

  state = {
    current: 0,
    currentStatus: "process",
    taksStatus: {}
  }

  updateLocalStorage = ( data ) => {
    let { start } = this.props;
    let ls = localStorage.getItem('swap');
    ls = ls ? JSON.parse(ls) : {}
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
        taksStatus[current] = error.message;
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

  render() {
    const { type, amount, SwapTransaction, SwapFinalize } = this.props
    const { current, taksStatus, currentStatus } = this.state
    return (
      <React.Fragment>
        <div className={`loader ${currentStatus}`}></div>
        <Steps size="small" direction="vertical" current={current} status={currentStatus}>
          { taskList[type].map((item, index) => <Step key={index} title={item.title} description={taksStatus[index]} />) }
        </Steps>
         { currentStatus === "done" &&
          <div className="success-block align-center">
            <h4 className="status-success">Success!</h4>
            <h6>
              <b>{amount} Remme tokens</b> have been sent: <BlockexplorerLink tx={ type ? SwapTransaction : SwapFinalize} type={type} />
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
