import React, { Component } from 'react'
import { Row, Col, Card } from 'antd';
import { Pie } from 'ant-design-pro/lib/Charts';

import { network } from '../../config.js'

const gridStyle = {
  width: '100%',
  overflow: "hidden"
};

class RemmeResourcesInfo extends Component {

  percent = (value) => {
    if (isNaN(value)) return 0.1;
    if (value === Infinity) return 0.1;
    if (value === 0) return  0.1;
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
    return (
      <React.Fragment>
        <h4>Resources info:</h4>
        <Card  bordered={false}>
          <Card.Grid style={gridStyle}>
            <h5>Used:</h5>
            <Row gutter={10}>
              <Col sm={24} md={8}><Pie percent={this.percent(data.account.ram_usage / data.account.ram_quota * 100)} color="#398bf7" animate={true} subTitle="RAM" total={this.total(data.account.ram_usage / data.account.ram_quota * 100).toFixed(2) + "%"} height={140} /><p className="align-center">{ this.formatBytes(data.account.ram_usage / 1024)} / { this.formatBytes(data.account.ram_quota) } kb</p></Col>
              <Col sm={24} md={8}><Pie percent={this.percent(data.account.cpu_limit.used / data.account.cpu_limit.max * 100)} color="#725af2" animate={true} subTitle="CPU" total={this.total(data.account.cpu_limit.used / data.account.cpu_limit.max * 100).toFixed(2) + "%"} height={140} /><p className="align-center">{ this.timeConversion(this.total(data.account.cpu_limit.used / 1000000)) } / { this.timeConversion(data.account.cpu_limit.max / 1000000) }</p></Col>
              <Col sm={24} md={8}><Pie percent={this.percent(data.account.net_limit.used / data.account.cpu_limit.max * 100)} color="#c787f5" animate={true} subTitle="NET" total={this.total(data.account.net_limit.used / data.account.cpu_limit.max * 100).toFixed(2) + "%"} height={140} /><p className="align-center">{ this.formatBytes(data.account.net_limit.used)} / { this.formatBytes(data.account.net_limit.max)  }</p></Col>
            </Row>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <h5 style={{ marginBottom: 26}}>Total:</h5>
            <Row gutter={10}>
              <Col sm={24} md={8}><h6> Staked by Others: </h6><p className="align-center">{ data.balance.staked_by_others } {network.coin}</p></Col>
              <Col sm={24} md={8}><h6> Staked by Me: </h6><p className="align-center">{ Number(data.account.total_resources.cpu_weight.split(' ')[0]) - data.balance.staked_by_others } {network.coin}</p></Col>
              <Col sm={24} md={8}><h6> Total Stake: </h6><p className="align-center">{ data.account.total_resources.cpu_weight }</p></Col>
            </Row>
          </Card.Grid>
        </Card>
      </React.Fragment>
    )
  }
}

export default RemmeResourcesInfo;
