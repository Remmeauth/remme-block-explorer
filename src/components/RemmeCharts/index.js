import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import { Row, Col, Icon } from 'antd';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import { ChartCard, MiniArea } from 'ant-design-pro/lib/Charts';
import moment from 'moment';

import "./style.css"

const ChartComponent = ({visitData}) => {
  return (
    <ChartCard contentHeight={178}>
      <NumberInfo
        subTitle="Price"
        total={'$0.0064'}
        status="up"
        subTotal={-1.1}
      />
      <MiniArea line height={45} data={visitData} color="#398bf7" borderColor="#398bf7"  />
      <NumberInfo
        subTitle="Market Cap"
        total={'$3,931,694'}
        status="up"
        subTotal={12.1}
      />
      <MiniArea line height={45} data={visitData} color="#735af2" borderColor="#735af2"  />
    </ChartCard>
  )
}

const BlockInfoComponent = ({icon, title, value, color, classes}) => (
  <ChartCard className={classes} title={title} avatar={<Icon type={icon} style={{color: color}}/> } total={value}/>
)

class RemmeCharts extends Component {

  state = {
    show: false
  }

  componentDidMount() {
    const visitData = [];
    const beginDay = new Date().getTime();
    for (let i = 0; i < 20; i += 1) {
      visitData.push({
        x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
        y: Math.floor(Math.random() * 100) + 10,
      });
    }

    this.setState({ visitData });

    const {wait} = this.props
    setTimeout(
      function() {
          this.setState({ show: true });
      }.bind(this)
    , wait);
  }

  render() {
    const {show, visitData} = this.state
    const { totalBlocks, producer } = this.props.data

    return (
      <React.Fragment>
        <h4>Network Stats</h4>
        <Row gutter={30}>
          <QueueAnim type="right" >
            <Col className="gutter-row"  md={24} lg={8} xl={10} key='0'>
              <ChartComponent visitData={visitData} />
            </Col>
          </QueueAnim>
          <Col className="gutter-row" sm={24} md={12} lg={8} xl={7}>
            { show &&
              <QueueAnim type="right"  >
                <BlockInfoComponent icon="code-sandbox" title="Total Blocks" value={totalBlocks} color="#f9b22b" key='1'/>
                <BlockInfoComponent icon="user" title="Total Accounts" value="52312" color="#56c0d8" key='2'/>
              </QueueAnim>
            }
          </Col>
          <Col className="gutter-row" sm={24} md={12} lg={8} xl={7}>
            { show &&
              <QueueAnim type="right" >
                <BlockInfoComponent icon="column-width" title="Total Transactions" color="#ef534f" value="1251256" key='3'/>
                <BlockInfoComponent classes="blockinfo-producer" icon="check-circle" title="Producer" value={producer} color="#4cd79c" key='4'/>
              </QueueAnim>
            }
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default RemmeCharts;
