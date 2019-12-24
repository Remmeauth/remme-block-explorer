import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Table, Collapse } from 'antd';
import ReactJson from 'react-json-view'

import { fetchBackend } from '../../functions/helpers'
import { RemmeResult, RemmeSpin, TimeStamp } from '../../components'
import { tableColunm } from '../../schemes'

const { Panel } = Collapse;

class Block extends Component {
  state = {
    loading: true
  }

  handleUpdate = async () => {
    const { id } = this.props.match.params
    try {
      const json = await fetchBackend('getBlock', id);
      this.setState({
        error: false,
        loading: false,
        raw: json,
        dataSource: [
          {
            key: '1',
            title: 'Producer',
            value: (<Link to={'/account/' + json.producer}>{json.producer}</Link>)
          },
          {
            key: '2',
            title: 'Id',
            value: json.id
          },
          {
            key: '3',
            title: 'Previous',
            value: (<Link onClick={this.forceUpdate} to={'/block/' + json.previous}>{json.previous}</Link>)
          },
          {
            key: '4',
            title: 'Confirmations',
            value: json.confirmed
          },
          {
            key: '5',
            title: 'Action Mroot',
            value: json.action_mroot
          },
          {
            key: '6',
            title: 'Transaction Mroot',
            value: json.transaction_mroot
          },
          {
            key: '7',
            title: 'Time',
            value: <TimeStamp timestamp={json.timestamp} />
          },
          {
            key: '8',
            title: 'Transactions',
            value: json.transactions.length
          }
        ],
        dataSourceTx: json.transactions.filter(item => {
          return item["trx"]["id"]
        }).map(( item, index ) => {
          return {
            key: index,
            tx: item["trx"]["id"],
            expiration: item["trx"]["transaction"]["expiration"],
            cpu_usage_us: item["cpu_usage_us"],
            net_usage_words: item["net_usage_words"],
            status: item["status"],
            actions: item["trx"]["transaction"]["actions"],
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
          loading ? (<div className="preload-block"><RemmeSpin /></div>) :
            error ? (<RemmeResult error={error} />) : (
            <React.Fragment>
              <h4>Block: <span className="block-color">#{raw.block_num}</span></h4>
              <Table className="block-info details-info" dataSource={dataSource} columns={tableColunm(['title', 'value'])} pagination={false} />
              <Collapse className="block-raw" accordion defaultActiveKey={['1']}>
               <Panel header="Block Raw Data" key="1">
                 <ReactJson src={raw} collapsed={true} theme="ocean" />
               </Panel>
             </Collapse>
             <h4>Transactions:</h4>
             <Table className="block-transactions" dataSource={dataSourceTx} columns={tableColunm(["tx", "expiration", "cpu", "net", "status", "actions"])} pagination={false} />
            </React.Fragment>
          )
        }
      </React.Fragment>
    )
  }
}

export default Block;
