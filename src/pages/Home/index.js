import React, { Component } from 'react';
import { Row, Col, Spin, Icon  } from 'antd';

import { RemmeCharts, RemmeBlocks, RemmeTransactions } from '../../components';

const loadIcon = <Icon type="setting" rotate={180} style={{ fontSize: 24 }} spin />;

class Home extends Component {

  state = {
    loading: true,
    data: 9483503,
  }

  componentDidMount() {
      setInterval(this.timer, 5000);




    if (document.readyState === 'complete') {
      this.setState({ loading: false });
    } else {
      window.addEventListener('load', this.handleLoad);
    }
  }

  timer = () => {
    const {data} = this.state
    console.log(data);
    this.setState({ data: data+1 });
  }

  handleLoad = () => {
    setTimeout(
      function() {
          this.setState({ loading: false });
      }.bind(this)
    , 700);
  }

  render() {
    const {loading, data} = this.state
    return (
      <React.Fragment>
        {!loading ? (
          <React.Fragment>
            <RemmeCharts wait={300}/>
            <RemmeBlocks wait={600} data={data}/>
            <Row gutter={30}>
              <Col lg={24} xl={12}>
                <RemmeTransactions wait={1500}/>
              </Col>
              <Col lg={24} xl={12}>
                <RemmeTransactions wait={1800}/>
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
