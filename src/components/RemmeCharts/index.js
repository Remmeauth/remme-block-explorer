import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';
import { Row, Col, Icon } from 'antd';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import { ChartCard, MiniArea } from 'ant-design-pro/lib/Charts';
import numeral from 'numeral';

import {decimal} from "../../config";

import "./style.css"

const ChartComponent = ({visitData}) => {
  const { prices, market_caps, prices_scale, market_caps_scale } = visitData;
  return (
    <ChartCard contentHeight={178}>
      <NumberInfo
        subTitle="Price"
        total={"$"+prices[0].y.toFixed(4)}
      />
      <MiniArea line height={45} data={prices} color="#398bf7" borderColor="#398bf7" scale={prices_scale}  />
      <NumberInfo
        subTitle="Market Cap"
        total={"$"+ numeral(market_caps[0].y).format('0,0')}
      />
      <MiniArea line height={45} data={market_caps} color="#735af2" borderColor="#735af2" scale={market_caps_scale} />
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
    const {wait} = this.props
    setTimeout(
      function() {
          this.setState({ show: true });
      }.bind(this)
    , wait);
  }

  render() {
    const {show} = this.state
    const { totalBlocks, marketChart, producers, global, guardians } = this.props.data
    return (
      <React.Fragment>
        <h4>Network Stats</h4>
        <Row gutter={30}>
          <QueueAnim type="right" >
            <Col className="gutter-row"  md={24} lg={8} xl={10} key='0'>
              <ChartComponent visitData={marketChart} />
            </Col>
          </QueueAnim>
          <Col className="gutter-row" sm={24} md={12} lg={8} xl={7}>
            { show &&
              <QueueAnim type="right"  >
                <div key='1'>
                  <BlockInfoComponent icon="code-sandbox" title="Total Blocks" value={totalBlocks} color="#f9b22b" key='1'/>
                  <BlockInfoComponent icon="user" title="Total Producers" value={producers.length} color="#56c0d8" key='2'/>
                </div>
              </QueueAnim>
            }
          </Col>
          <Col className="gutter-row" sm={24} md={12} lg={8} xl={7}>
            { show &&
              <QueueAnim type="right" delay={300} >
                <div key='1'>
                  <BlockInfoComponent icon="column-width" title="Total Stake" color="#ef534f" value={ (Number(global.total_guardians_stake) / decimal).toFixed(0)} key='3'/>
                  <BlockInfoComponent classes="blockinfo-guardians" icon="check-circle" title="Total Guardians" value={guardians} color="#4cd79c" key='4'/>
                </div>
              </QueueAnim>
            }
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}

export default RemmeCharts;
