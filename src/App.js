import React, {Component} from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Layout } from 'antd';

import logo from './assets/logo.png';
import { Navigation, DayNightMode } from './components'

const { Header, Content } = Layout;

class App extends Component {
  render() {
    const { nightMode } = this.props
    return (
      <Layout className={ nightMode ? 'theme-dark' : 'theme-light'}>
        <Header>
          <div className="header-wrap">
            <Link to="/">
              <h2 style={{float: 'left', marginRight: '10px'}}>Explorer</h2>
              {this.sad && <img className="logo" src={logo} alt="Logo" />}
            </Link>
            <Navigation />
            <DayNightMode />
          </div>
        </Header>
        <Content>
          <div className="content-wrap">
            {this.props.children}
          </div>
        </Content>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    nightMode: state.conf.nightMode,
  }
};

export default connect(mapStateToProps)(App);
