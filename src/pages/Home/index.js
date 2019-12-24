import React, { Component } from 'react';
import { Spin, Icon  } from 'antd';

import { fetchBackend } from '../../functions/helpers'
import { RemmeCharts, RemmeBlocks, RemmeTransactions, RemmeProducers } from '../../components';

const loadIcon = <Icon type="setting" rotate={180} style={{ fontSize: 24 }} spin />;

class Home extends Component {
  intervalID = 0;

  state = {
    loading: true,
    data: {},
  }

  handleUpdate = async () => {
    try {
      const json = await fetchBackend('getInfo');
      console.log(json);
      if (!json.marketChart) { return false }
      this.setState({
        loading: false,
        data: json
      });
    } catch (error) {
      this.setState({
        loading: true,
        data: {},
      });
    }
  }

  componentDidMount() {
    this.handleUpdate();
    this.intervalID = setInterval(this.handleUpdate, 4000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  render() {
    const {loading, data} = this.state
    return (
      <React.Fragment>
        {!loading ? (
          <React.Fragment>
            <RemmeCharts wait={300} data={data}/>
            <RemmeBlocks wait={600} data={data.blocks}/>
            <RemmeProducers data={data.producers} wait={1500} size={25} title="Producers" viewAll={true}/>
            <RemmeTransactions data={data.transactions} wait={1800}/>
          </React.Fragment>
        ) : (
          <div className="preload-block">
            <Spin indicator={loadIcon} />
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default Home;
