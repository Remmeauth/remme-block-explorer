import React, { Component } from "react";

class BlockexplorerLink extends Component {

  render() {
    const { type, tx } = this.props;
    return (
      <React.Fragment>
        {{
         0: (<a href={"https://blockexplorer.remme.io/transactions/" + tx} target="_blank" rel="noopener noreferrer">Transaction link</a>),
         1: (<a href={"https://ropsten.etherscan.io/tx/" + tx} target="_blank" rel="noopener noreferrer">Transaction link</a>)
        }[type]}
      </React.Fragment>
    )
  }
}

export default BlockexplorerLink;
