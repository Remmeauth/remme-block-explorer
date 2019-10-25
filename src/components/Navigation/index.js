import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { Menu, Icon, Dropdown, Button, Drawer } from 'antd';

import { SmartLink } from "../../components";
import './style.css';

const NavigationItems = [
  {
    title: 'Dashboard',
    link: '/',
    icon: 'pie-chart',
    type: 'simple',
    key: 1,
  },
  {
    title: 'Wallet',
    link: '/wallet',
    icon: 'column-width',
    type: 'simple',
    key: 2,
  },
  {
    title: 'Swap',
    link: '/swap',
    icon: 'swap',
    type: 'simple',
    key: 5,
  },
  {
    title: 'Producers',
    link: '/producers',
    icon: 'check-circle',
    type: 'simple',
    key: 6,
  },
  {
    title: 'Guardians',
    link: '/guardian',
    icon: 'user',
    type: 'simple',
    key: 7,
  }
];

class Navigation extends Component {

  state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { location } = this.props;
    return (

      <div className="nav-wrapper" key="nav">

      <Icon className="mobile-nav-button" type="menu" onClick={this.showDrawer} />

      <Drawer
          title="Basic Drawer"
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          { NavigationItems.map( item =>
            <SmartLink
                key={item.key}
                link={item.link} >
              <p onClick={this.onClose}>
                {item.title}
              </p>
            </SmartLink>
          )}
        </Drawer>


        { NavigationItems.map( item =>
          !item.items ?
            item.type === 'button'
              ? <SmartLink
                  key={item.key}
                  link={item.link} >
                  <Button type={item.style} style={{ marginLeft: 8 }}>
                    {item.title}
                  </Button>
                </SmartLink>
              : <Menu key={item.key} style={{ lineHeight: '64px', float: 'left' }} mode="horizontal" selectedKeys={[location.pathname]}>
                  <Menu.Item key={item.link}>
                    <SmartLink
                      link={item.link} >
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </SmartLink>
                  </Menu.Item>
                </Menu>
          : <Dropdown
              key={item.key}
              overlay={
                <Menu>
                  {item.items.map( subitem =>
                    <Menu.Item key={subitem.key}>
                      <SmartLink
                        link={subitem.link} >
                          {subitem.title}
                      </SmartLink>
                    </Menu.Item>
                  )}
                </Menu>
              }>
               { item.type === 'button'
                 ? <Button style={{ marginLeft: 8 }} type={item.style}>
                     {item.title}
                   </Button>
                 : <aa className="ant-nav-dropdown">
                     <Icon type={item.icon} /> {item.title} <Icon type="down" />
                   </aa>
               }
            </Dropdown>
        )}
     </div>
    )
  }
}

export default withRouter(Navigation);
