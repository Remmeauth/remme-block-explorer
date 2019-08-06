import React, { Component } from 'react'
import ReactJson from 'react-json-view'

import { RemmeSpin } from '../../components'
import { network } from '../../config.js'

class RemmeAccountTxInfo extends Component {

  state = {
    loading: true,
    actions: {}
  }

  handleUpdate = async () => {
    const { id } = this.props;
    try {
      const response = await fetch(`${network.backendAddress}/api/getActions/${id}`);
      const json = await response.json();
      this.setState({
        loading:false,
        actions: json.actions.reverse()
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  componentDidMount() {
    this.handleUpdate();
  }

  render() {
    const {actions, loading} = this.state;
    return (
      <React.Fragment>
        {loading ? <RemmeSpin/> : <ReactJson src={actions} collapsed={2} theme="ocean" />}
      </React.Fragment>
    )
  }
}

export default RemmeAccountTxInfo;
