import React, { Component } from 'react'
import { Row, Col, Card } from 'antd';
import { Pie } from 'ant-design-pro/lib/Charts';

const gridStyle = {
  width: '100%',
  overflow: "hidden"
};

class RemmeResourcesInfo extends Component {

  percent = (value) => {
    if (value === 0) return 0;
    if (value < 5) return 5;
    return value;
  }

  total = (value) => {
    if (value === 0) return 0;
    if (value < 0.01) return 0.01;
    return value;
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
              <Col sm={24} md={8}><Pie percent={this.percent(data.account.ram_usage / data.account.ram_quota * 100)} color="#398bf7" animate={true} subTitle="RAM" total={this.total(data.account.ram_usage / data.account.ram_quota * 100).toFixed(2) + "%"} height={140} /><p className="align-center">{ this.total(data.account.ram_usage / 1024).toFixed(2) } kb / { (data.account.ram_quota / 1024).toFixed(2) } kb</p></Col>
              <Col sm={24} md={8}><Pie percent={this.percent(data.account.cpu_limit.used / data.account.cpu_limit.max * 100)} color="#725af2" animate={true} subTitle="CPU" total={this.total(data.account.cpu_limit.used / data.account.cpu_limit.max * 100).toFixed(2) + "%"} height={140} /><p className="align-center">{ this.total(data.account.cpu_limit.used / 1000000).toFixed(2) } sec / { (data.account.cpu_limit.max / 1000000).toFixed(2) } sec</p></Col>
              <Col sm={24} md={8}><Pie percent={this.percent(data.account.net_limit.used / data.account.cpu_limit.max * 100)} color="#c787f5" animate={true} subTitle="NET" total={this.total(data.account.net_limit.used / data.account.cpu_limit.max * 100).toFixed(2) + "%"} height={140} /><p className="align-center">{ this.total(data.account.net_limit.used / 1024).toFixed(2) } kb / { (data.account.net_limit.max / 1024).toFixed(2) } kb</p></Col>
            </Row>
          </Card.Grid>
          <Card.Grid style={gridStyle}>
            <h5 style={{ marginBottom: 26}}>Total:</h5>
            <Row gutter={10}>
              <Col sm={24} md={8}><h6> CPU weight: </h6><p className="align-center">{ data.account.total_resources.cpu_weight }</p></Col>
              <Col sm={24} md={8}><h6> NET weight: </h6><p className="align-center">{ data.account.total_resources.net_weight }</p></Col>
              <Col sm={24} md={8}><h6> Owner: </h6><p className="align-center">{ data.account.total_resources.owner }</p></Col>
            </Row>
          </Card.Grid>
        </Card>
      </React.Fragment>
    )
  }
}

export default RemmeResourcesInfo;
