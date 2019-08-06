import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

import CreateSteps from '../../components/Swap/CreateSteps';

class SwapInit extends Component {
  render() {
    const { SwapInitiated } = this.props;
    return (
      <React.Fragment>
        { SwapInitiated && <Redirect to="/swap" /> }
        <h4 className="align-center">Swap Remme tokens:</h4>
        <div className="swap-wrapper">
          <h6 className="align-center gray-text">Please follow the steps below to initiate a swap.</h6><br/>
          <CreateSteps/>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    SwapInitiated: state.auth.SwapInitiated,
  }
};

export default connect(mapStateToProps)(SwapInit);
