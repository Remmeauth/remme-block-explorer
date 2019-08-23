import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Table } from 'antd';

import { tableColunm } from '../../schemes'
import { network } from '../../config.js'
import { TimeStamp } from '../../components'

class RemmeAccountInfo extends Component {

  render() {
    const { data, forceUpdate } = this.props
    const accountDataSource = [
      {
        key: '1',
        title: 'Name',
        value: (<Link onClick={forceUpdate} to={'/account/' + data.account.account_name}>{data.account.account_name}</Link>)
      },
      {
        key: '2',
        title: 'Total Balance',
        value: (<b>{data.balance.total_balance} {network.coin}</b>)
      },
      {
        key: '8',
        title: 'Total USD Value :',
        value: (<b>{data.balance.total_usd_value} $</b>)
      },
      {
        key: '4',
        title: 'Unstaked',
        value: `${data.balance.unstaked} ${network.coin}`
      },
      {
        key: '5',
        title: 'Staked',
        value: `${data.balance.staked} ${network.coin}`
      },
      {
        key: '6',
        title: 'Unstaking',
        value: `${data.balance.unstaking} ${network.coin}`
      },
      {
        key: '9',
        title: 'Staked by Others',
        value: `${data.balance.staked_by_others} ${network.coin}`
      },
      {
        key: '7',
        title: 'Created time',
        value: (<TimeStamp timestamp={data.account.created} />)
      }
    ]

    return (
      <React.Fragment>
        <h4>Account info:</h4>
        <Table className="account-info details-info" dataSource={accountDataSource} columns={tableColunm(['title', 'value'])} pagination={false} />
      </React.Fragment>
    )
  }
}

export default RemmeAccountInfo;
