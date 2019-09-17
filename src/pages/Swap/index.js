import React, {Component} from 'react';
import { connect } from "react-redux";
import { Modal, Button, Tooltip } from 'antd';
import jwt from "jsonwebtoken";
import { secret } from "../../config";

import { logout, cancel } from "../../actions";
import SwapHistory from "../../components/Swap/SwapHistory";
import './style.css'

const { confirm } = Modal;

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
        //window.location.reload();
      }
    });
  };

  download = (e) => {
    e.preventDefault();
    let swap, token;
    try {
      swap = localStorage.getItem('swap');
      if(swap){
        swap = JSON.parse(swap);
        if(swap.hasOwnProperty('SwapRawTransaction'))
          swap.SwapRawTransaction = JSON.parse(swap.SwapRawTransaction);
        if(swap.hasOwnProperty('SwapRawTransactionApprove'))
          swap.SwapRawTransactionApprove = JSON.parse(swap.SwapRawTransactionApprove);
      }

      token = localStorage.getItem('token');
      if(token){
        token = jwt.decode(token,secret);
      }
    }catch (e) {
      console.log(e.message);
      token = swap = {};
    }

    const data = {
      swap,
      token
    };

    const file = new Blob([JSON.stringify(data, null, "\t")], {type: "text/plain"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, "report.json");
    else { // Others
      const a = document.createElement("a"),
          url = URL.createObjectURL(file);
      a.href = url;
      a.download = "report.json";
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  };

  render() {
    return (
      <div className="Div">
        <h2 className="align-center">Swap process</h2>
        <div className="swap-wrapper">
          <SwapHistory/>
          <div className={"swap-buttons"}>
            <Button type="primary" onClick={this.lock} className={"new-swap"}>Init new Swap</Button>
            <Tooltip placement="topRight" title="This action will save all technical information of the current swap for diagnosis purposes. This data contains sensitive information that will allow anyone to manage (or finish) the swap. Do not share it with anyone that you do not trust!">
              <h6  href={"#"} onClick={this.download} className={"swap-data link"}>Save swap private data</h6>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { logout, cancel })(Swap);
