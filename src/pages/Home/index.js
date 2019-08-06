import React, { Component } from 'react';
import { Row, Col, Spin, Icon  } from 'antd';

import { network } from '../../config.js'
import { RemmeCharts, RemmeBlocks, RemmeTransactions, RemmeProducers } from '../../components';

const loadIcon = <Icon type="setting" rotate={180} style={{ fontSize: 24 }} spin />;

class Home extends Component {
  intervalID = 0;

  state = {
    loading: true,
    data: {},
  }

  handleUpdate = async () => {
    try {
      const response = await fetch( network.backendAddress + `/api/getInfo`);
      const json = await response.json();
      //console.log(json);
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
    this.intervalID = setInterval(this.handleUpdate, 4000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    const {loading, data} = this.state
    return (
      <React.Fragment>
        {!loading ? (
          <React.Fragment>
            <RemmeCharts wait={300} data={data}/>
            <RemmeBlocks wait={600} data={data.blocks}/>
            <Row gutter={30}>
              <Col lg={24} xl={12}>
                <RemmeTransactions data={data.transactions} wait={1500}/>
              </Col>
              <Col lg={24} xl={12}>
                <RemmeProducers data={data.producers} wait={1800}/>
              </Col>
            </Row>
          </React.Fragment>
        ) : (
          <div className="preload-block">
            <Spin indicator={loadIcon} />
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default Home;
