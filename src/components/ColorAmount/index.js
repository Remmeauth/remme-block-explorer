import React, { Component } from 'react'

import { network } from '../../config.js'

class ColorAmount extends Component {
  render() {
    const { amount, color, className } = this.props;
    return (
      <React.Fragment>
        {
          !amount ?
            <p className={className}>0 {network.coin}</p> :
            <p className={className} style={{color: color}}>{Number(amount.toFixed(4))} {network.coin}</p>
        }
      </React.Fragment>
    )
  }
}

export default ColorAmount;
