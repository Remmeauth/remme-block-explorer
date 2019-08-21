import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Table, Collapse, Spin, Icon, Result, Button } from 'antd';
import ReactJson from 'react-json-view'
import Moment from 'react-moment';

import { network, dateFormat } from '../../config.js'

import './style.css'

const { Panel } = Collapse;
const loadIcon = <Icon type="setting" rotate={180} style={{ fontSize: 24 }} spin />;

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

class Transaction extends Component {
  state = {
    loading: true
  }

  handleUpdate = async () => {
    const { id } = this.props.match.params
    try {
      const response = await fetch( network.backendAddress + `/api/getTransaction/` + id);
      const json = await response.json();
      this.setState({
        error: false,
        loading: false,
        raw: json,
        dataSource: [
          {
            key: '1',
            name: 'Block Number',
            value: (<Link onClick={this.forceUpdate} to={'/block/' + json.block_num}>{json.block_num}</Link>)
          },
          {
            key: '2',
            name: 'Hash',
            value: json.id
          },
          {
            key: '3',
            name: 'Block Time',
            value: <Moment format={dateFormat}>{json.block_time}</Moment>
          },
          {
            key: '4',
            name: 'Actions',
            value: json.trx.trx.actions.length
          }
        ],
      });
    } catch (error) {
      this.setState({
        error: "Unknown Transaction",
        loading: false
      });
    }
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
    const { dataSource, raw, loading, error } = this.state;
    return (
      <React.Fragment>
        {
          loading ? (<div className="preload-block"><Spin indicator={loadIcon} /></div>) :
            error ? (<Result title={error} extra={ <Button type="primary" key="console"> Go Dashboard </Button> } />) : (
            <React.Fragment>
              <h4>Tx: <span className="transition-color">{raw.id}</span></h4>
              <Table className="transition-info details-info" dataSource={dataSource} columns={columns} pagination={false} />
              <Collapse className="transition-raw" accordion defaultActiveKey={['1']}>
               <Panel header="Tx Raw Data" key="1">
                 <ReactJson src={raw} collapsed={true} theme="ocean" />
               </Panel>
             </Collapse>
             <Collapse className="transition-raw" accordion defaultActiveKey={['1']}>
              <Panel header="Actions" key="1">
                <ReactJson src={raw.trx.trx.actions} collapsed={2} theme="ocean" />
              </Panel>
            </Collapse>
            </React.Fragment>
          )
        }
      </React.Fragment>
    )
  }
}

export default Transaction;
