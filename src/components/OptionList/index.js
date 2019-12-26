import React, { Component } from 'react'

import { Select } from 'antd';

const { Option } = Select;

class OptionList extends Component {
  render() {
    const listItems = this.props.producers.map((item) => <Option key={item.owner} value={item.owner}>{item.owner}</Option>);
    return (
      <Select placeholder="Please select producers" mode="multiple" style={{ minWidth: '350px' }} onChange={this.props.onChange} value={this.props.values}>
        {listItems}
      </Select>
    )
  }
}

export default OptionList;
