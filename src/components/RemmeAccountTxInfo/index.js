import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Table, Tag } from 'antd';
import Moment from 'react-moment';

import { RemmeSpin } from '../../components'
import { network, dateFormat } from '../../config.js'

const { CheckableTag } = Tag;

const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

const columns = [
  {
    title: 'TX',
    dataIndex: 'tx',
    key: 'tx',
    render: (text) => (<Link to={'/transaction/' + text}>{text.substring(0,10) + '...' + text.slice(-10)}</Link>)
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: (text) => (<Moment format={dateFormat}>{text}</Moment>)
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
    key: 'data',
  }
];

class RemmeAccountTxInfo extends Component {

  state = {
    selectedTags: [],
    loading: true,
    actions: {}
  }

  handleUpdate = async () => {
    const { id } = this.props;
    try {
      const response = await fetch(`${network.backendAddress}/api/getActions/${id}`);
      const json = await response.json();

      console.log(json);

      var dataSource = [];
      var dataFilter = [];
      const actions = json.actions.reverse()

      actions.forEach(item => {
        if (!dataSource.some(el => el.hex_data === item.action_trace.act.hex_data)) {
          dataFilter.push(item.action_trace.act.name)
          dataSource.push({
            key: item.global_action_seq,
            tx: item.action_trace.trx_id,
            date: item.block_time,
            name: item.action_trace.act.name,
            data: JSON.stringify(item.action_trace.act.data),
            hex_data: item.action_trace.act.hex_data
          })
        }
      });

      this.setState({
        loading:false,
        actions: actions,
        dataSource: dataSource,
        dataFilter: dataFilter.filter(unique)
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  componentDidMount() {
    this.handleUpdate();
  }

  handleChange(tag, checked) {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    this.setState({ selectedTags: nextSelectedTags });

  }

  render() {
    const { loading, dataSource, dataFilter, selectedTags} = this.state;
    return (
      <React.Fragment>
        {
          loading ?
            <RemmeSpin/> :
            <div>
              <div className="table-filter">
              <span>Action Filter:</span>
              {dataFilter.map(tag => (
                <CheckableTag
                  key={tag}
                  checked={selectedTags.indexOf(tag) > -1}
                  onChange={checked => this.handleChange(tag, checked)}
                >
                  {tag}
                </CheckableTag>
              ))}
              </div>
              <Table dataSource={dataSource.filter(el => { if (!selectedTags.length) return true; return selectedTags.includes(el.name); })} pagination={{ pageSize: 25 }} columns={columns} />
            </div>
        }
      </React.Fragment>
    )
  }
}

export default RemmeAccountTxInfo;
