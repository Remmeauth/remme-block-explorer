import React, {Component} from 'react';
import { connect } from "react-redux";
import { Modal, Button } from 'antd';

import { logout, cancel } from "../../actions";
import SwapHistory from "../../components/Swap/SwapHistory";

const confirm = Modal.confirm;

class Swap extends Component {


  lock = () => {
    const { logout, cancel } = this.props;
    confirm({
      title: 'Do you want to close current Swap?',
      content: 'When clicked the OK button, this swap will be closed!',
      onOk() {
        localStorage.removeItem("token");
        localStorage.removeItem("swap");
        logout();
        cancel();
        window.location.reload();
      },
      onCancel() {},
    });
  };

  render() {
    return (
      <div className="Div">
        <h2 className="align-center">Swap process</h2>
        <div className="swap-wrapper">
          <SwapHistory/>
          <div className="align-center">
            <Button type="primary" onClick={this.lock}>Init new Swap</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { logout, cancel })(Swap);
