import React, { Component } from 'react';
import { Row, Col, Collapse } from 'antd';
import QueueAnim from 'rc-queue-anim';
import ReactJson from 'react-json-view'

import { network } from '../../config.js'
import { MapContainer, RemmeSpin, RemmeResult, RemmeAccountInfo, RemmeResourcesInfo, RemmeProducerInfo, RemmeAccountTxInfo } from '../../components'

const { Panel } = Collapse;

class Account extends Component {
  state = {
    loading: true
  }

  handleAccountInfo = async () => {
    const { id } = this.props.match.params
    try {
      const response = await fetch(`${network.backendAddress}/api/getAccount/${id}`);
      const json = await response.json();
      console.log(json);
      if (!json.account.account_name) {

        this.setState({
          error: "Unknown Account",
          loading: false
        });
      } else {
        this.setState({
          error: false,
          loading: false,
          raw: json,
        });
      }
    } catch (error) {
      console.log(error.message);
      this.setState({
        error: "Unknown Account",
        loading: false
      });
    }

  }

  handleUpdate = () => {
    this.handleAccountInfo();
  }

  forceUpdate = () => {
    this.setState({
      error: false,
      loading: true
    }, () => {
      this.handleUpdate();
    })
  }

  componentDidMount() {
    this.handleUpdate();
  }

  render() {
    const { raw, loading, error } = this.state;

    return (
      <React.Fragment>
        { loading ? (<RemmeSpin/>) :
            error ? (<RemmeResult error={error} />) : (
            <React.Fragment>
              <QueueAnim delay={300} interval={300} type="right" component={Row} gutter={30}>
                <Col lg={24} xl={12} key="1">
                  <RemmeAccountInfo data={raw} forceUpdate={this.forceUpdate}/>
                </Col>
                <Col lg={24} xl={12} key="2">
                  <RemmeResourcesInfo data={raw}/>
                </Col>
              </QueueAnim>

              { raw.producer && <QueueAnim delay={900} interval={200} type="right" component={Row} gutter={30}>
                <Col lg={24} xl={12} key="1">
                  <RemmeProducerInfo forceUpdate={this.forceUpdate} data={raw}/>
                </Col>
                <Col lg={24} xl={12} key="2">
                  <MapContainer data={raw}/>
                </Col>
              </QueueAnim> }

              <QueueAnim delay={1200} interval={300} type="right"  >
                <Collapse className="account-raw" accordion defaultActiveKey={['3']} key='1'>
                 <Panel header="Account Raw Data" key="1">
                   <ReactJson src={raw.account} collapsed={2} theme="ocean" />
                 </Panel>
                 <Panel header={"Account Permissions ("+raw.account.permissions.length+")"} key="2">
                   <ReactJson src={raw.account.permissions} collapsed={2} theme="ocean" />
                 </Panel>
                </Collapse>
                <div key="2">
                  <h4>Actions:</h4>
                  <RemmeAccountTxInfo id={raw.account.account_name}/>
                </div>
              </QueueAnim>
            </React.Fragment>
          )
        }
      </React.Fragment>
    )
  }
}

export default Account;
