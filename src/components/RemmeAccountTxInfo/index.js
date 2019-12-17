import React, { Component } from 'react'
import { Table, Tag, Row, Col, Button} from 'antd';

import { RemmeSpin } from '../../components'
import { network } from '../../config.js'
import { tableColunm } from '../../schemes'

const { CheckableTag } = Tag;

const unique = (value, index, self) => {
  return self.indexOf(value) === index
}

class RemmeAccountTxInfo extends Component {

  state = {
    dataSource: [],
    selectedTags: [],
    loading: true,
    visible: false
  }

  pushActions = (actions) => {
    var { dataSource } = this.state;
    try {
      var dataFilter = [];
      actions.forEach(item => {
        if (!dataSource.some(el => el.hex_data === item.action_trace.act.hex_data && el.block_time === item.block_time )) {
          dataFilter.push(item.action_trace.act.name)
          dataSource.push({
            key: item.account_action_seq,
            tx: item.action_trace.trx_id,
            date: item.block_time,
            name: item.action_trace.act.name,
            data: item.action_trace.act.data,
            hex_data: item.action_trace.act.hex_data,
            block_time: item.block_time
          })
        }
      });
      this.setState({
        loading:false,
        dataSource: dataSource,
        dataFilter: dataFilter.filter(unique),
        visible: actions.pop().account_action_seq !== 0
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  handleUpdate = async () => {
    const { id } = this.props;
    try {
      const response = await fetch(`${network.backendAddress}/api/getActions/${id}`);
      const json = await response.json();
      this.pushActions(json.actions.reverse());
    } catch (e) {
      console.log(e.message);
    }
  }


  handleLoadMore = async () => {
    const { id } = this.props;
    const { dataSource } = this.state;
    if (dataSource.length && dataSource.pop().key !== 0 ) {
      const last = dataSource.pop().key
      const response = await fetch(`${network.backendAddress}/api/getActions/${id}/${last}`);
      const json = await response.json();
      this.pushActions(json.actions.reverse());
    }
  }

  componentDidMount() {
    this.handleUpdate();
  }

  handleChange(tag, checked) {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    this.setState({ selectedTags: nextSelectedTags });
  }

  render() {
    const { loading, dataSource, dataFilter, selectedTags, visible} = this.state;
    return (
      <React.Fragment>
        {
          loading ?
            <RemmeSpin/> :
            <div>
              <div className="table-filter">
              <span>Action Filter:</span>
              {dataFilter.map(tag => (
                <CheckableTag
                  key={tag}
                  checked={selectedTags.indexOf(tag) > -1}
                  onChange={checked => this.handleChange(tag, checked)}
                >
                  {tag}
                </CheckableTag>
              ))}
              </div>
              <Table ref={this.actionsTable} dataSource={dataSource.filter(el => { if (!selectedTags.length) return true; return selectedTags.includes(el.name); })} pagination={{ pageSize: 25 }} columns={tableColunm(["tx", "date", "name", "data"])} />
              { visible && <Row style={{marginBottom: 15}}>
                  <Col lg={24} xl={24} key="1" className="align-center">
                    <Button type="primary" onClick={this.handleLoadMore}>Load More Pages</Button>
                  </Col>
                </Row>
              }
            </div>
        }
      </React.Fragment>
    )
  }
}

export default RemmeAccountTxInfo;
