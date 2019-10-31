import React, { Component } from 'react'
import { Row, Col, Card, Table, Progress } from 'antd';

import { network } from '../../config.js'
import { tableColunm, gridStyle } from '../../schemes'
import { TimeStamp } from '../../components'

const DifferenceInWeeks = (d1, d2) => {
  const data2 = new Date(d2 + 'Z')
  const DifferenceInTime = data2.getTime() - d1.getTime();
  const DifferenceInWeeks = DifferenceInTime / (1000 * 3600 * 24 * 7);
  return DifferenceInWeeks
}

const maturityFormatter = (weeks) => {
  let left = 25 - weeks;
  if (left < 1) {
    left = 1;
  } else if (left > 25) {
    left = 25;
  }

  return {
    text: `${Math.floor(left)}/25`,
    percent: 100 / 25 * Math.floor(left),
    ratio: Number((1 / 25 * left).toFixed(4))
  }

}

class RemmeResourcesInfo extends Component {

  percent = (value) => {
    if (isNaN(value)) return 0.1;
    if (value === Infinity) return 0.1;
    if (value === 0) {
      return  0.1;
    }
    if (value < 5) return 5;
    return value;
  }

  total = (value) => {
    if (isNaN(value)) return 0;
    if (value === 0) return 0;
    if (value < 0.01) return 0.01;
    return value;
  }

  formatBytes = (bytes, decimals) => {
    if(bytes === 0) return '0 B';
    var k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  timeConversion = (sec) => {

       var seconds = (sec).toFixed(2);

       var minutes = (sec / 60).toFixed(2);

       var hours = (sec / (60 * 60)).toFixed(2);

       var days = (sec / (60 * 60 * 24)).toFixed(2);

       if (seconds < 60) {
           return seconds + " Sec";
       } else if (minutes < 60) {
           return minutes + " Min";
       } else if (hours < 24) {
           return hours + " Hrs";
       } else {
           return days + " Days"
       }
   }



  render() {
    const { data } = this.props;
    const date1 = new Date();
    const weeks_to_maturity = DifferenceInWeeks(date1, data.account.voter_info.stake_lock_time);
    const maturity = maturityFormatter(weeks_to_maturity)

    const accountDataSource = [
      {
        key: '0',
        title: 'Voter stake',
        value: `${data.balance.staked} ${network.coin}`
      },
      {
        key: '1',
        title: 'Unstaking',
        value: `${data.balance.unstaking} ${network.coin}`
      },
      {
        key: '2',
        title: 'Last reassertion time',
        value: <TimeStamp timestamp={data.account.voter_info.last_reassertion_time} />
      },
      {
        key: '3',
        title: 'Stake locked until',
        value: <TimeStamp timestamp={data.account.voter_info.stake_lock_time} />
      },
      {
        key: '4',
        title: 'Weeks to maturity',
        value: <Progress style={{margin: '6px 0'}} percent={100} status={maturity.percent !== 1 ? 'active' : 'normal'} successPercent={maturity.percent} format = { (percent, successPercent) => maturity.text } />
      },

      {
        key: '5',
        title: 'Current vote power (ratio)',
        value: maturity.ratio
      },
      {
        key: '6',
        title: 'Current vote power (raw) ',
        value: (maturity.ratio * data.balance.staked)
      }
    ]
    return (
      <React.Fragment>
        <h4>Resources info:</h4>
        <Card  bordered={false}>
          <Card.Grid style={gridStyle}>
            <h5>Used:</h5>
            <Row gutter={10} className="resources-card">
              <Col sm={24} md={8} className="align-center">
                <h6 className="align-center">RAM</h6>
                <Progress className="resources-progress" strokeColor="#4cd79c" width={110} type="circle" strokeWidth={10} percent={this.percent(data.account.ram_usage / data.account.ram_quota * 100)} format={percent => `${this.total(data.account.ram_usage / data.account.ram_quota * 100).toFixed(2)} %`} />
                <p className="align-center">{ this.formatBytes(data.account.ram_usage / 1024)} / { this.formatBytes(data.account.ram_quota) } kb</p>
              </Col>
              <Col sm={24} md={8} className="align-center">
                <h6>CPU</h6>
                <Progress className="resources-progress" strokeColor="#ef534f" width={110} type="circle" strokeWidth={10} percent={this.percent(data.account.cpu_limit.used / data.account.cpu_limit.max * 100)} format={percent => `${this.total(data.account.net_limit.used / data.account.cpu_limit.max * 100).toFixed(2)} %`} />
                <p>{ this.timeConversion(this.total(data.account.cpu_limit.used / 1000000)) } / { this.timeConversion(data.account.cpu_limit.max / 1000000) }</p>
              </Col>
              <Col sm={24} md={8} className="align-center">
                <h6>NET</h6>
                <Progress className="resources-progress" strokeColor="#f9b22b" width={110} type="circle" strokeWidth={10} percent={this.percent(data.account.net_limit.used / data.account.cpu_limit.max * 100)} format={percent => `${this.total(data.account.net_limit.used / data.account.cpu_limit.max * 100).toFixed(2)} %`} />
                <p>{ this.formatBytes(data.account.net_limit.used)} / { this.formatBytes(data.account.net_limit.max)  }</p>
              </Col>
            </Row>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <h5 style={{ marginBottom: 26}}>Total:</h5>
            <Row gutter={10}>
              <Col sm={24} md={8}><h6> Staked by Others: </h6><p className="align-center">{ data.balance.staked_by_others } {network.coin}</p></Col>
              <Col sm={24} md={8}><h6> Staked by Me: </h6><p className="align-center">{ Number(data.account.total_resources.cpu_weight.split(' ')[0]) - data.balance.staked_by_others } {network.coin}</p></Col>
              <Col sm={24} md={8}><h6> Total Stake: </h6><p className="align-center">{ Number(data.account.total_resources.cpu_weight.split(' ')[0]) } {network.coin}</p></Col>
            </Row>
          </Card.Grid>
        </Card>

        <h4>Stake info:</h4>
        <Table className="account-info details-info" dataSource={accountDataSource} columns={tableColunm(['title', 'value'])} pagination={false} />


      </React.Fragment>
    )
  }
}

export default RemmeResourcesInfo;
