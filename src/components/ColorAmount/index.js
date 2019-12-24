import React, { Component } from 'react'

class ColorAmount extends Component {
  render() {
    const { amount, color, className } = this.props;
    return (
      <React.Fragment>
        {
          !amount ?
            <p className={className}>0 {process.env.REACT_APP_SYSTEM_COIN}</p> :
            <p className={className} style={{color: color}}>{Number(amount.toFixed(4))} {process.env.REACT_APP_SYSTEM_COIN}</p>
        }
      </React.Fragment>
    )
  }
}

export default ColorAmount;
