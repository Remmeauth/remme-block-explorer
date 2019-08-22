import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Table, Collapse, Tabs } from 'antd';
import ReactJson from 'react-json-view'

import { RemmeResult, RemmeSpin, TimeStamp } from '../../components'
import { network } from '../../config.js'
import { tableColunm } from '../../schemes'
import { tracesToTree } from '../../functions/helpers'

const { Panel } = Collapse;
const { TabPane } = Tabs;

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
        dataTraces: tracesToTree(json.traces),
        dataActions: json.trx.trx.actions.map((i, index) => {
          return {
            ...i,
            key: index
          }
        }),
        dataSource: [
          {
            key: '1',
            title: 'Block Number',
            value: (<Link to={'/block/' + json.block_num}>{json.block_num}</Link>)
          },
          {
            key: '2',
            title: 'Hash',
            value: json.id
          },
          {
            key: '3',
            title: 'Block Time',
            value: <TimeStamp timestamp={json.block_time}/>
          },
          {
            key: '4',
            title: 'Actions',
            value: json.trx.trx.actions.length
          },
          {
            key: '5',
            title: 'Status',
            value: json.trx.receipt.status
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

  componentDidMount() {
    this.handleUpdate();
  }

  render() {
    const { dataSource, raw, loading, error, dataActions, dataTraces } = this.state;
    return (
      <React.Fragment>
        {
          loading ? (<div className="preload-block"><RemmeSpin /></div>) :
            error ? (<RemmeResult error={error} />) : (
            <React.Fragment>
              <h4>Tx: <span className="transition-color">{raw.id}</span></h4>
              <Table className="transition-info details-info" dataSource={dataSource} columns={tableColunm(['title', 'value'])} pagination={false} />
              <Collapse className="transition-raw" accordion defaultActiveKey={['1']}>
               <Panel header="Tx Raw Data" key="1">
                 <ReactJson src={raw} collapsed={true} theme="ocean" />
               </Panel>
             </Collapse>
             <h4>Actions:</h4>
             <Tabs className="tabs-card" defaultActiveKey="1">
              <TabPane tab="Actions" key="1">
                <Table className="details-info" columns={tableColunm(['account', 'name', 'data'])} dataSource={dataActions} pagination={false} />
              </TabPane>
              <TabPane tab={`Traces (${raw.traces.length})`}  key="2">
                <Table className="details-info" columns={tableColunm(['account', 'name', 'data'])} dataSource={dataTraces} pagination={false} />
              </TabPane>
            </Tabs>
            </React.Fragment>
          )
        }
      </React.Fragment>
    )
  }
}

export default Transaction;
