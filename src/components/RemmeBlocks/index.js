import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import { Row, Col, Card, Icon } from 'antd';
import Moment from 'react-moment';

import { dateFormat } from '../../config.js'

import './style.css'

class RemmeBlocks extends Component {
  index = 0;
  state = {
    show: false,
    items: [],
    type: 'left',
  };

  componentDidMount() {
    const { wait } = this.props
    setTimeout(
      function() {
          this.setState({ show: true });
      }.bind(this)
    , wait);
  }

  componentDidUpdate(prevProps) {
    if (this.index !== this.props.data[0].block_num) {
      this.index = this.props.data[0].block_num
      this.state.show && this.add();
    }
  }

  add = () => {
    let { items } = this.state;
    const { data } = this.props;
    if (!items[0]) {
      this.setState({ items: data, type: 'left' });
      return false;
    }
    const firstBlock = data[0].block_num
    const lastBlock = items[0].block_num
    for ( var i = 0; i < (firstBlock - lastBlock); i++ ) {
        items.pop();
    }
    this.setState({ items, type: 'right' });
    setTimeout(
        function() {
          this.setState({ items: data, type: 'right' });
        }.bind(this), 145 * (firstBlock - lastBlock)
    );
  }

  render() {
    const {show} = this.state
    return (
      <React.Fragment>
        <h4>Blocks</h4>
        <Row className="blocks-row" gutter={30}>
          { show &&
            <QueueAnim type={this.state.type}>
              {this.state.items.map((item) =>
                <Col className="gutter-row" sm={24} md={12} lg={6} key={item.block_num}>
                  <Card className="block-item" title=<Link to={"/block/" + item.block_num}><Icon type="code-sandbox" /> {item.block_num}</Link> bordered={true}>
                    <span className="block-transactions">{item.transactions} Transactions</span>
                    <span className="block-producer">Producer: <Link to={"/account/" + item.producer}><b>{item.producer}</b></Link></span>
                    <span className="block-time"><Moment format={dateFormat}>{item.timestamp}</Moment></span>
                  </Card>
                </Col>
              )}
          </QueueAnim>}
        </Row>
      </React.Fragment>
    )
  }
}

export default RemmeBlocks;
