import React, { Component } from 'react';
import { Row, Col, Spin, Icon  } from 'antd';

import { network } from '../../config.js'
import { RemmeCharts, RemmeBlocks, RemmeTransactions, RemmeProducers } from '../../components';

const loadIcon = <Icon type="setting" rotate={180} style={{ fontSize: 24 }} spin />;

class Producers extends Component {
  intervalID = 0;

  state = {
    loading: true,
    data: {},
  }

  handleUpdate = async () => {
    try {
      const response = await fetch( network.backendAddress + `/api/getInfo`);
      const json = await response.json();
      console.log(json);
      if (!json.marketChart) { return false }
      this.setState({
        loading: false,
        data: json
      });
    } catch (error) {
      this.setState({
        loading: true,
        data: {},
      });
    }
  }

  componentDidMount() {
    this.handleUpdate();
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    const {loading, data} = this.state
    return (
      <React.Fragment>
        {!loading ? <RemmeProducers data={data.producers} wait={300} size={1000} title="Producers"/> : (
          <div className="preload-block">
            <Spin indicator={loadIcon} />
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default Producers;
