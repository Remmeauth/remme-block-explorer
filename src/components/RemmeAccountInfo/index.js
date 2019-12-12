import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Table, Row, Col, Card, Tag, Progress } from 'antd';

import { tableColunm, gridStyle } from '../../schemes'
import { TimeStamp, ColorAmount } from '../../components'

class RemmeAccountInfo extends Component {
  render() {
    const { data, forceUpdate } = this.props;

    const rewardsDataSource = [
      {
        key: '1',
        title: 'Rewards per day (estimation for past 7 days):',
        value: ''
      },
      {
        key: '2',
        title: 'Producer',
        value: !data.producer ? 'Not a Producer' : <ColorAmount className='align-center' amount={ data.producer.rewards } color="#52c41a" />
      },
      {
        key: '3',
        title: 'Guardian',
        value: !data.account.voter_info.guardian ? 'Not a Guardian' : <ColorAmount className='align-center' amount={ data.account.voter_info.rewards  } color="#52c41a" />
      },
    ];

    const accountDataSource = [
      {
        key: '1',
        title: 'Name',
        value: (<Link onClick={forceUpdate} to={'/account/' + data.account.account_name}>{data.account.account_name}</Link>)
      },
      {
        key: '2',
        title: 'Type',
        value: (
          <React.Fragment>
            { !data.account.voter_info.guardian && !data.producer && <Tag color="#4cd79c">Account</Tag> }
            { data.producer && <Tag color="#ef534f">Producer</Tag> }
            { data.account.voter_info.guardian && <Tag color="#f9b22b">Guardian</Tag> }
          </React.Fragment>
        )
      },
      {
        key: '3',
        title: 'Voted for',
        value: data.account.voter_info.producers.map((item, index) => { return <Link style={{marginRight: 5}} onClick={forceUpdate} key={index} to={'/account/' + item}>{item}</Link> })
      },
      {
        key: '4',
        title: 'Created time',
        value: (<TimeStamp timestamp={data.account.created} />)
      },
    ]

    return (
      <React.Fragment>
        <h4>Account info:</h4>
        <Table className="account-info details-info" dataSource={accountDataSource} columns={tableColunm(['title', 'value'])} pagination={false} />

        <Card bordered={false}>
          <Card.Grid style={gridStyle}>
            <h5>Balance:</h5>
            <Row gutter={10}>
              <Col sm={24} md={8}><h6> Unstaked: </h6>       <ColorAmount className='align-center' amount={ data.balance.unstaked } color="#52c41a" /></Col>
              <Col sm={24} md={8}><h6> Total balance: </h6>  <ColorAmount className='align-center' amount={ data.balance.total_balance } color="#2990ff" /></Col>
              <Col sm={24} md={8}><h6> Total USD Value: </h6><p className="align-center">{`${Number(data.balance.total_usd_value.toFixed(2))} $`} </p></Col>
            </Row>
            <Progress
              style={{margin: '6px 0'}}
              percent={100}
              successPercent={100 / data.balance.total_balance * data.balance.unstaked}
              showInfo={false}
            />
          </Card.Grid>
        </Card>

        <h4>Rewards:</h4>
        <Card bordered={false}>
          <Card.Grid style={gridStyle}>
            <h5>Not Claimed Rewards:</h5>
            <Row gutter={10}>
              <Col sm={24} md={8}><h6> Producer: </h6><ColorAmount className='align-center' amount={ data.balance.producerNotClimedRewards } color="#52c41a" /></Col>
              <Col sm={24} md={8}><h6> Guardian: </h6><ColorAmount className='align-center' amount={ data.balance.guardianNotClimedRewards } color="#2990ff" /></Col>
              <Col sm={24} md={8}><h6> Total USD Value: </h6><p className="align-center">{ `${Number(data.balance.NotClimedRewards_usd_value.toFixed(2))} $`}</p></Col>
            </Row>
            <Progress
              style={{margin: '13px 0'}}
              strokeColor={data.balance.producerNotClimedRewards + data.balance.guardianNotClimedRewards === 0 ? "#8b9296" : "#2990ff" }
              percent={100}
              successPercent={100 / (data.balance.producerNotClimedRewards + data.balance.guardianNotClimedRewards) * data.balance.producerNotClimedRewards }
              showInfo={false}
            />
          </Card.Grid>
        </Card>
        <Table className="rewards-info details-info" dataSource={rewardsDataSource} columns={tableColunm(['title', 'value'])} pagination={false} />
      </React.Fragment>
    )
  }
}

export default RemmeAccountInfo;
