import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Table, Collapse, Spin, Icon, Result, Button, Tabs, Tag } from 'antd';
import ReactJson from 'react-json-view'
import Moment from 'react-moment';

import { network, dateFormat } from '../../config.js'
//import { keyVal } from '../../schemes'

import './style.css'

const { Panel } = Collapse;
const loadIcon = <Icon type="setting" rotate={180} style={{ fontSize: 24 }} spin />;
const { TabPane } = Tabs;

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

const columnsActions = [
  {
    title: 'Account',
    dataIndex: 'account',
    key: 'account',
    render: text => (<span><Icon type="bell" theme="filled" /> {text}</span> )
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => (<Tag color="#ef534f">{text}</Tag>),
  },
  {
    title: 'Data',
    dataIndex: 'data',
    key: 'data'
  },
];


const unflatten = (arr) => {
  var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for(var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.action_ordinal] = {
      key: arrElem.action_ordinal,
      account: arrElem.receiver,
      name: arrElem.act.name,
      data: JSON.stringify(arrElem.act.data),
      creator_action_ordinal: arrElem.creator_action_ordinal,
      action_ordinal: arrElem.action_ordinal,
    };
  }

  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.creator_action_ordinal) {
        if (typeof mappedArr[mappedElem['creator_action_ordinal']]['children'] === 'undefined') {
          mappedArr[mappedElem['creator_action_ordinal']]['children'] = [];
        }
        mappedArr[mappedElem['creator_action_ordinal']]['children'].push(mappedElem);
      } else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
}


const prepareTraces = (json) => {
    const newtraces = unflatten(json.traces)
    return newtraces
}

class Transaction extends Component {
  state = {
    loading: true
  }

  handleUpdate = async () => {
    const { id } = this.props.match.params
    try {
      const response = await fetch( network.backendAddress + `/api/getTransaction/` + id);
      const json = await response.json();

      const dataTraces = prepareTraces(json);

      this.setState({
        error: false,
        loading: false,
        raw: json,
        dataTraces: dataTraces,
        dataActions: json.trx.trx.actions.map(item => { return { key: item.hex_data, account: item.account, data: JSON.stringify(item.data), name: item.name } }),
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
    const { dataSource, raw, loading, error, dataActions, dataTraces } = this.state;
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
             <h4>Actions:</h4>
             <Tabs className="tabs-card" defaultActiveKey="1">
              <TabPane tab="Actions" key="1">
                <Table className="details-info" columns={columnsActions} dataSource={dataActions} pagination={false} />
              </TabPane>
              <TabPane tab={`Traces (${raw.traces.length})`}  key="2">
                <Table className="details-info" columns={columnsActions} dataSource={dataTraces} pagination={false} />
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
