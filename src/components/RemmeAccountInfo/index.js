import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Table, Row, Col, Card, Tag, Progress, Badge, Icon } from 'antd';


import { tableColunm } from '../../schemes'
import { network } from '../../config.js'
import { TimeStamp, RemmeVoter } from '../../components'

const gridStyle = {
  width: '100%',
  overflow: "hidden"
};

const  ClaimedRewards = (props) => {
  if (props.text !== 0) {
    return (<span style={{color: '#4cd79c'}}>{props.text.toFixed(2)} {network.coin}</span>)
  } else {
    return (<span>{props.text.toFixed(2)} {network.coin}</span>)
  }
}

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
        title: 'Type',
        value: (
          <React.Fragment>
            { !data.voter.guardian && !data.producer && <Tag color="#4cd79c">Account</Tag> }
            { data.producer && <Tag color="#ef534f">Producer</Tag> }
            { data.voter.guardian && <Tag color="#f9b22b">Guardian</Tag> }
          </React.Fragment>
        )
      },
      {
        key: '3',
        title: 'Voted for',
        value: !data.voter ? "-" : data.voter.producers.map((item, index) => { return <Link style={{marginRight: 5}} onClick={forceUpdate} key={index} to={'/account/' + item}>{item}</Link> })
      },
      {
        key: '4',
        title: 'Created time',
        value: (<TimeStamp timestamp={data.account.created} />)
      },


      {
        key: '9',
        title: 'Not Claimed Rewards',
        value: (<ClaimedRewards text={(data.balance.producer_per_stake_pay ? data.balance.producer_per_stake_pay + data.balance.producer_per_vote_pay : 0)} />)
      },
    ]

    return (
      <React.Fragment>
        <h4>Account info:</h4>
        <Table className="account-info details-info" dataSource={accountDataSource} columns={tableColunm(['title', 'value'])} pagination={false} />

        <Card  bordered={false}>
          <Card.Grid style={gridStyle}>
            <h5>Balance:</h5>
            <Row gutter={10}>
              <Col sm={24} md={8}><h6> Unstaked: </h6><p className="align-center" style={{color: '#52c41a'}}>{ `${data.balance.unstaked} ${network.coin}` }</p></Col>
              <Col sm={24} md={8}><h6> Total balance: </h6><p className="align-center" style={{color: '#2990ff'}}>{ `${data.balance.total_balance} ${network.coin}` }</p></Col>
              <Col sm={24} md={8}><h6> Total USD Value: </h6><p className="align-center">{`${data.balance.total_usd_value} $`} </p></Col>
            </Row>
            <Progress style={{margin: '6px 0'}} percent={100} successPercent={100 / data.balance.total_balance * data.balance.unstaked} showInfo={false} />
          </Card.Grid>
        </Card>

        <h4>Rewards:</h4>
      </React.Fragment>
    )
  }
}

export default RemmeAccountInfo;
