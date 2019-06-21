import React, { Component } from 'react';

import QueueAnim from 'rc-queue-anim';

import { Row, Col, Card, Icon } from 'antd';

const Block = () => {
  return (
    <Col className="gutter-row" span={4}>
      <Card title="Card title" bordered={false}>
        Card content
      </Card>
    </Col>
  )
}

class RemmeBlocks extends Component {

  index = 9483503;
  state = {
        show: false,
        items: [{
          children: 'eoshuobipool',
          key: 9483503,
        }, {
          children: 'eoshuobipool',
          key: 9483502,
        }, {
          children: 'eoshuobipool',
          key: 9483501,
        }, {
          children: 'eoshuobipool',
          key: 9483500,
        }, {
          children: 'eoshuobipool',
          key: 9483499,
        }, {
          children: 'eoshuobipool',
          key: 9483498,
        }, {
          children: 'eoshuobipool',
          key: 9483497,
        }, {
          children: 'eoshuobipool',
          key: 9483496
        }],
        type: 'left',
      };

      componentDidMount() {
        const {wait} = this.props
        setTimeout(
          function() {
              this.setState({ show: true });
          }.bind(this)
        , wait);
      }

      componentDidUpdate(prevProps) {
        if (this.index != this.props.data) {
          this.index = this.props.data
          this.state.show && this.add();
        }
      }

      add = () => {
          let {items} = this.state;

          items.pop();
          this.setState({ items, type: 'right' });

          setTimeout(
              function() {
                items.unshift({
                  children: 'new',
                  key: this.index,
                });
                this.setState({ items, type: 'left' });
              }.bind(this), 450);
        }

  render() {
    const {show} = this.state
    const {data} = this.props
    return (
      <React.Fragment>
        <h4>Blocks</h4>
        <Row gutter={30}>
          { show && <QueueAnim type={this.state.type}>
            {this.state.items.map((item) =>
              <Col className="gutter-row" sm={24} md={12} lg={6} key={item.key}>
                <Card className="block-item" title=<a><Icon type="code-sandbox" /> {item.key}</a> bordered={true}>
                  <span className="block-transactions">0 Transactions</span>
                  <span className="block-producer">Producer: <a><b>Valera{item.children}</b></a></span>
                  <span className="block-time">Time: 1/21, 5:34:49 pm</span>
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
