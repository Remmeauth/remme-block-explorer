import React, { Component } from 'react'
import { Table, Tag, Icon, Result } from 'antd';

import { SmartLink, RemmeVoter, TimeStamp } from '../../components'


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },
];

class RemmeGuardianInfo extends Component {

  state = {
    guardianDataSource: []
  }

  componentDidMount() {
    const { data } = this.props
    console.log(data);

    this.setState({
      guardianDataSource: [
        {
          key: '0',
          name: 'Status',
          value: <Tag color="#4cd79c">Guardian</Tag>
        },
        {
          key: '1',
          name: 'Stake locked until',
          value: <TimeStamp timestamp={data.guardian.vote_mature_time} />
        }
      ],
        error: true
      });
    }


  render() {
    const { guardianDataSource, error } = this.state;
    return (
      <React.Fragment>
        <h4>Guardian info:</h4>
        <Table className="guardian-info details-info" dataSource={guardianDataSource} columns={columns} pagination={false} />
      </React.Fragment>
    )
  }
}

export default RemmeGuardianInfo;
