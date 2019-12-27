import React, { Component } from 'react'
import { Tag, Menu, Dropdown } from 'antd';

class SelectNetwork extends Component {
  state = {
    visible: false
  }

  menu = (
    <Menu>
      <Menu.Item key="1"><a href='https://remchain.remme.io' rel="noopener noreferrer">Remchain</a></Menu.Item>
      <Menu.Item key="0"><a href='https://testchain.remme.io' rel="noopener noreferrer">Testchain</a></Menu.Item>
    </Menu>
  );

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };

  toggle = () => {
    const {visible} = this.state
    this.setState({ visible: !visible });
  }

  render() {
    const { visible } = this.state
    return (
      <div className="select-network" style={{ lineHeight: '60px', float: 'right', marginTop: '4px', marginRight: '10px' }} onClick={() => this.toggle()}>
        <Dropdown overlay={this.menu} visible={visible} onVisibleChange={this.handleVisibleChange} placement="topRight">
          <Tag color="#1890ff" style={{textTransform: 'capitalize', cursor: 'pointer'}}> {process.env.REACT_APP_REM_ENV_NAME} </Tag>
        </Dropdown>
      </div>
    )
  }
}

export default SelectNetwork;
