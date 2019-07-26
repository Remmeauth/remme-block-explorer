import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

class RemmeResult extends Component {
  render() {
    const { error } = this.props;
    return (
      <Result
        title={error}
        extra={
          <Link to="/">
            <Button type="primary" key="console">
              Go Dashboard
            </Button>
          </Link>
        }
      />
    )
  }
}

export default RemmeResult;
