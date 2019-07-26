import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import Moment from 'react-moment';

import { coin, dateFormat } from '../../config.js'

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

class RemmeAccountInfo extends Component {

  state = {
    accountDataSource: []
  }

  componentDidMount() {
    const { data, forceUpdate } = this.props
    this.setState({
      accountDataSource: [
        {
          key: '1',
          name: 'Name',
          value: (<Link onClick={forceUpdate} to={'/account/' + data.account.account_name}>{data.account.account_name}</Link>)
        },
        {
          key: '2',
          name: 'Total Balance',
          value: (<b>{data.balance.total_balance} {coin}</b>)
        },
        {
          key: '8',
          name: 'Total USD Value :',
          value: (<b>{data.balance.total_usd_value} $</b>)
        },
        {
          key: '4',
          name: 'Unstaked',
          value: `${data.balance.unstaked} ${coin}`
        },
        {
          key: '5',
          name: 'Staked',
          value: `${data.balance.staked} ${coin}`
        },
        {
          key: '9',
          name: 'Staked by Others',
          value: `${data.balance.staked_by_others} ${coin}`
        },
        {
          key: '6',
          name: 'Other tokens',
          value: '-'
        },
        {
          key: '7',
          name: 'Created time',
          value: (<Moment format={dateFormat}>{data.account.created}</Moment>)
        }
      ],
    });
  }


  render() {
    const { accountDataSource } = this.state;
    return (
      <React.Fragment>
        <h4>Account info:</h4>
        <Table className="account-info details-info" dataSource={accountDataSource} columns={columns} pagination={false} />
      </React.Fragment>
    )
  }
}

export default RemmeAccountInfo;
