import React, { Component } from 'react'
import { Spin, Icon } from 'antd';
import { Link } from 'react-router-dom'

import { network } from '../../config.js'

const loadIcon = <Icon type="loading" style={{ fontSize: 18 }} spin />;

class RemmeVoter extends Component {

  state = {
    list: false,
  }

  handleUpdate = async () => {
    const {id} = this.props
    let producers = [];
    try {
      const response = await fetch(`${network.backendAddress}/api/getVotersInfo`);
      const json = await response.json();
      json.rows.forEach((item) => {
        if (item.owner === id) {
          producers = item.producers
        }
      });
      this.setState({ list: producers.length ? producers : ["-"] });
    } catch (e) {
      this.setState({ list: ["-"] });
      console.log(e.message);
    }
  }

  componentDidMount() {
    this.handleUpdate();
  }

  render() {
    const {list} = this.state
    const {forceUpdate} = this.props
    return (
      <React.Fragment>
        {!list ? <Spin indicator={loadIcon} /> : list.map((item, index) => { return <Link style={{marginRight: 5}} onClick={forceUpdate} key={index} to={'/account/' + item}>{item}</Link> })}
      </React.Fragment>
    )
  }
}

export default RemmeVoter;
