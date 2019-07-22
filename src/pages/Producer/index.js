import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Table, Collapse, Spin, Icon, Result, Button } from 'antd';
import ReactJson from 'react-json-view'

import { backendAddress } from '../../config.js'

import { MapContainer } from '../../components'

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

class Producer extends Component {
  state = {
    loading: true
  }

  handleUpdate = async () => {
    const { id } = this.props.match.params
    try {
      const response = await fetch( backendAddress + `/api/getProducer/` + id);
      const json = await response.json();
      console.log(json);
      this.setState({
        error: false,
        loading: false,
        raw: json,
        dataSource: [
          {
            key: '1',
            name: 'Name',
            value: (<Link onClick={this.forceUpdate} to={'/account/' + json.producer_account_name}>{json.producer_account_name}</Link>)
          },
          {
            key: '2',
            name: 'Votes',
            value: json.producer_votes
          },
          {
            key: '3',
            name: 'Rewards',
            value: json.producer_rewards
          },
          {
            key: '4',
            name: 'Position',
            value: json.producer_position
          },
          {
            key: '5',
            name: 'Location',
            value: json.org.location.country + ', ' + json.org.location.name
          },
          {
            key: '6',
            name: 'Links',
            value: 'links'
          },
          {
            key: '7',
            name: 'Public Key',
            value: json.account.producer_key
          },
          {
            key: '8',
            name: 'Nodes',
            value: json.nodes.length
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
              <h4>Producer: <span className="transition-color">{raw.producer_account_name}</span></h4>
              <Table className="producer-info details-info" dataSource={dataSource} columns={columns} pagination={false} />
              <Collapse className="transition-raw" accordion defaultActiveKey={['1']}>
               <Panel header="Tx Raw Data" key="1">
                 <ReactJson src={raw} collapsed={true} theme="ocean" />
               </Panel>
             </Collapse>
             <h4>Nodes location:</h4>
             <MapContainer/>
            </React.Fragment>
          )
        }
      </React.Fragment>
    )
  }
}

export default Producer;
