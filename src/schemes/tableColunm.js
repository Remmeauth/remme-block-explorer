import React from 'react';
import { Link } from 'react-router-dom'
import { Icon, Tag } from 'antd';

import { TimeStamp } from '../components'

export const tableColunm = (columns) => {
  return columns.map(name => {
    return list[name];
  })
}

const list = {

  'title': {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },

  "name": {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => (<Tag color="#ef534f">{text}</Tag>),
  },

  'value': {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },

  'account' : {
    title: 'Account',
    dataIndex: 'account',
    key: 'account',
    render: text => (<span><Icon type="bell" /> {text}</span> )
  },

  'data': {
    title: 'Data',
    dataIndex: 'data',
    key: 'data',
    render: (text) => (<span>{JSON.stringify(text)}</span>)
  },

  'tx': {
    title: 'TX ID',
    dataIndex: 'tx',
    key: 'tx',
    render: (text) => (<Link to={'/transaction/' + text}>{text.substring(0,10) + '...' + text.slice(-10)}</Link>)
  },

  'date': {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    render: text => (<TimeStamp timestamp={text} />)
  },

  'expiration': {
    title: 'Expiration',
    dataIndex: 'expiration',
    key: 'expiration',
    render: text => (<TimeStamp timestamp={text} />)
  },

  'cpu': {
    title: 'CPU',
    dataIndex: 'cpu_usage_us',
    key: 'cpu_usage_us',
  },

  'net': {
    title: 'NET',
    dataIndex: 'net_usage_words',
    key: 'net_usage_words',
  },

  'status': {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },

  'actions': {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions1',
    render: arr => (
      <React.Fragment>
        {arr.map((action, i) => (<Tag key={i} color="#ef534f">{action["name"]}</Tag>))}
      </React.Fragment>
    )
  }

}
