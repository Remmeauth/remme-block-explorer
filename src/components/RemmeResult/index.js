import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Button, Row, Col, Card } from 'antd';

class RemmeResult extends Component {
  render() {
    const { error, description } = this.props;
    return (
      <Row>
        <Col className="align-center" key="1">
          <Card className="card-with-padding" >
            <h4>{error}</h4>
            <p>{description}</p>
            <Link to="/">
              <Button type="primary" key="console">
                Go Dashboard
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
    )
  }
}

export default RemmeResult;
