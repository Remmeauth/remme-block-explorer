import React, { Component } from 'react'
import { Menu, Dropdown, Icon, Input } from 'antd';

const { Search } = Input;

class SearchButton extends Component {

  state = {
    visible: false
  }

  find = (value) => {
    if (value.length === 64) {
      window.location.href = '/transaction/' + value
    } else if (!isNaN(parseInt(value))) {
      window.location.href = '/block/' + value
    } else {
      window.location.href = '/account/' + value
    }
  }

  menu = (
    <Menu>
      <Menu.Item key="0">
      <Search placeholder="input search text" onSearch={value => this.find(value)} enterButton />
      </Menu.Item>
    </Menu>
  );

  toggle = () => {
    const { visible } = this.state;
    this.setState({visible: !visible})
  }

  render() {
    const { visible } = this.state
    return (
      <div className="day-night-mode" style={{ lineHeight: '60px', float: 'right', marginTop: '4px', marginRight: '15px', fontSize: '24px' }} >
        <Dropdown overlay={this.menu} visible={visible} placement="topRight">
          <Icon type="search" onClick={() => this.toggle()} />
        </Dropdown>
      </div>
    )
  }
}

export default SearchButton;
