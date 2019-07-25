import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Table, Collapse, Spin, Icon, Result, Button, Tag } from 'antd';
import ReactJson from 'react-json-view'
import Moment from 'react-moment';

import { backendAddress, dateFormat } from '../../config.js'

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

const columnsTx = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (text) => (<Link to={'/transaction/' + text}>{text.substring(0,10) + '...' + text.slice(-10)}</Link>)
  },
  {
    title: 'Expiration',
    dataIndex: 'expiration',
    key: 'expiration',
  },
  {
    title: 'CPU',
    dataIndex: 'cpu_usage_us',
    key: 'cpu_usage_us',
  },
  {
    title: 'NET',
    dataIndex: 'net_usage_words',
    key: 'net_usage_words',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
  }
];

class Block extends Component {
  state = {
    loading: true
  }

  handleUpdate = async () => {
    const { id } = this.props.match.params
    try {
      const response = await fetch( backendAddress + `/api/getBlock/` + id);
      const json = await response.json();
      this.setState({
        error: false,
        loading: false,
        raw: json,
        dataSource: [
          {
            key: '1',
            name: 'Producer',
            value: (<Link to={'/account/' + json.producer}>{json.producer}</Link>)
          },
          {
            key: '2',
            name: 'Id',
            value: json.id
          },
          {
            key: '3',
            name: 'Previous',
            value: (<Link onClick={this.forceUpdate} to={'/block/' + json.previous}>{json.previous}</Link>)
          },
          {
            key: '4',
            name: 'Confirmations',
            value: json.confirmed
          },
          {
            key: '5',
            name: 'Action Mroot',
            value: json.action_mroot
          },
          {
            key: '6',
            name: 'Transaction Mroot',
            value: json.transaction_mroot
          },
          {
            key: '7',
            name: 'Time',
            value: <Moment format={dateFormat}>{json.timestamp}</Moment>
          },
          {
            key: '8',
            name: 'Transactions',
            value: json.transactions.length
          }
        ],
        dataSourceTx: json.transactions.filter(item => {
          return item["trx"]["id"]
        }).map(( item, index ) => {
          return {
            key: index,
            id: item["trx"]["id"],
            expiration: item["trx"]["transaction"]["expiration"],
            cpu_usage_us: item["cpu_usage_us"],
            net_usage_words: item["net_usage_words"],
            status: item["status"],
            actions: item["trx"]["transaction"]["actions"].map(action =>  (<Tag color="#ef534f">volcano{action["name"]}</Tag>)),
          }
        })
      });
    } catch (error) {
      this.setState({
        error: "Unknown Block",
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
    const { dataSource, raw, dataSourceTx, loading, error } = this.state;
    return (
      <React.Fragment>
        {
          loading ? (<div className="preload-block"><Spin indicator={loadIcon} /></div>) :
            error ? (<Result title={error} extra={ <Button type="primary" key="console"> Go Dashboard </Button> } />) : (
            <React.Fragment>
              <h4>Block: <span className="block-color">#{raw.block_num}</span></h4>
              <Table className="block-info details-info" dataSource={dataSource} columns={columns} pagination={false} />
              <Collapse className="block-raw" accordion defaultActiveKey={['1']}>
               <Panel header="Block Raw Data" key="1">
                 <ReactJson src={raw} collapsed={true} theme="ocean" />
               </Panel>
             </Collapse>
             <h4>Transactions:</h4>
             <Table className="block-transactions" dataSource={dataSourceTx} columns={columnsTx} pagination={false} />
            </React.Fragment>
          )
        }
      </React.Fragment>
    )
  }
}

export default Block;
