import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Spin, Icon, Result, Row, Col, Card, Button } from 'antd';
import { Pie } from 'ant-design-pro/lib/Charts';
import Moment from 'react-moment';

import QueueAnim from 'rc-queue-anim';

import { backendAddress, coin, dateFormat } from '../../config.js'

import { MapContainer } from '../../components'

import './style.css'

const loadIcon = <Icon type="setting" rotate={180} style={{ fontSize: 24 }} spin />;
const updating = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const gridStyle = {
  width: '100%',
  overflow: "hidden"
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },
];

class Account extends Component {
  state = {
    loading: true
  }

  handleProducerInfo = async () => {
    try {
      this.setState({
        error: false,
        loading: false,
        producerDataSource: [
          {
            key: '1',
            name: 'Position',
            value: "# 1"
          },
          {
            key: '2',
            name: 'Votes',
            value: "12512166123"
          },
          {
            key: '4',
            name: 'Public Key',
            value: "EOS8MpYyXwn3DLqk9Y9XTHYcd6wGGijNqJefFoQEwEoXTq1awZ42w"
          },
          {
            key: '5',
            name: 'Location',
            value: "CN, HK, China"
          },
          {
            key: '6',
            name: 'Links',
            value: 'links'
          }
        ],
      });
    } catch (error) {
      console.log(error.message);
      this.setState({
        error: "Unknown Producer",
        loading: false
      });
    }
  }

  handleAccountInfo = async () => {
    const { id } = this.props.match.params
    try {
      const response = await fetch(`${backendAddress}/api/getAccount/${id}`);
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
          accountDataSource: [
            {
              key: '1',
              name: 'Name',
              value: (<Link onClick={this.forceUpdate} to={'/account/' + json.account.account_name}>{json.account.account_name}</Link>)
            },
            {
              key: '2',
              name: 'Total Balance',
              value: `${json.balance.total_balance} ${coin}`
            },
            {
              key: '8',
              name: 'Total USD Value :',
              value: `${json.balance.total_usd_value} $`
            },
            {
              key: '4',
              name: 'Unstaked',
              value: `${json.balance.unstaked} ${coin}`
            },
            {
              key: '5',
              name: 'Staked',
              value: `${json.balance.staked} ${coin}`
            },
            {
              key: '9',
              name: 'Staked by Others',
              value: `${json.balance.staked_by_others} ${coin}`
            },
            {
              key: '6',
              name: 'Other tokens',
              value: '-'
            },
            {
              key: '7',
              name: 'Created time',
              value: (<Moment format={dateFormat}>{json.account.created}</Moment>)
            }
          ],
        });
        //this.handleProducerInfo();
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
    const { accountDataSource, producerDataSource, raw, loading, error } = this.state;
    return (
      <React.Fragment>
        { loading ? (<div className="preload-block"><Spin indicator={loadIcon} /></div>) :
            error ? (<Result title={error} extra={ <Button type="primary" key="console"> Go Dashboard </Button> } />) : (
            <React.Fragment>

              <QueueAnim delay={300} interval={300} type="right" component={Row} gutter={30}>
                <Col lg={24} xl={12} key="1">
                  <h4>Account info:</h4>
                  <Table className="account-info details-info" dataSource={accountDataSource} columns={columns} pagination={false} />
                </Col>
                <Col lg={24} xl={12} key="4">
                  <h4>Resources info:</h4>
                  <Card  bordered={false}>
                  <Card.Grid style={gridStyle}>
                    <h5 style={{textAlign: 'left'}}>Used:</h5>
                    <Row gutter={10}>
                      <Col sm={24} md={8}><Pie percent={raw.account.ram_usage / raw.account.ram_quota * 100} color="#398bf7" animate={true} subTitle="RAM" total={(raw.account.ram_usage / raw.account.ram_quota * 100).toFixed(1) + "%"} height={140} /><p className="align-center">{ (raw.account.ram_usage / 1024).toFixed(2) } kb / { (raw.account.ram_quota / 1024).toFixed(2) } kb</p></Col>
                      <Col sm={24} md={8}><Pie percent={raw.account.cpu_limit.used / raw.account.cpu_limit.max * 100} color="#725af2" animate={true} subTitle="CPU" total={(raw.account.cpu_limit.used / raw.account.cpu_limit.max * 100).toFixed(1) + "%"} height={140} /><p className="align-center">{ (raw.account.cpu_limit.used / 1000000).toFixed(2) } sec / { (raw.account.cpu_limit.max / 1000000).toFixed(2) } sec</p></Col>
                      <Col sm={24} md={8}><Pie percent={raw.account.net_limit.used / raw.account.cpu_limit.max * 100} color="#9e76f7" animate={true} subTitle="NET" total={(raw.account.net_limit.used / raw.account.cpu_limit.max * 100).toFixed(1) + "%"} height={140} /><p className="align-center">{ (raw.account.net_limit.used / 1024).toFixed(2) } kb / { (raw.account.net_limit.max / 1024).toFixed(2) } kb</p></Col>
                    </Row>
                  </Card.Grid>

                  <Card.Grid style={gridStyle}>
                    <h5 style={{textAlign: 'left', marginBottom: 26}}>Total:</h5>
                    <Row gutter={10}>
                      <Col sm={24} md={8}><h6> CPU weight: </h6><p className="align-center">{ raw.account.total_resources.cpu_weight }</p></Col>
                      <Col sm={24} md={8}><h6> NET weight: </h6><p className="align-center">{ raw.account.total_resources.net_weight }</p></Col>
                      <Col sm={24} md={8}><h6> Owner: </h6><p className="align-center">{ raw.account.total_resources.owner }</p></Col>
                    </Row>
                  </Card.Grid>


                  </Card>
                </Col>
              </QueueAnim>



            </React.Fragment>
          )
        }
      </React.Fragment>
    )
  }
}

export default Account;
