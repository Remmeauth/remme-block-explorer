import React, { Component } from 'react'
import { Table, Tag, Icon, Result } from 'antd';

import { SmartLink } from '../../components'


const Telegram = () => (
  <svg width="13px" fill="currentColor" viewBox="0 0 300 300">
  <path id="XMLID_497_" d="M5.299,144.645l69.126,25.8l26.756,86.047c1.712,5.511,8.451,7.548,12.924,3.891l38.532-31.412 c4.039-3.291,9.792-3.455,14.013-0.391l69.498,50.457c4.785,3.478,11.564,0.856,12.764-4.926L299.823,29.22 c1.31-6.316-4.896-11.585-10.91-9.259L5.218,129.402C-1.783,132.102-1.722,142.014,5.299,144.645z M96.869,156.711l135.098-83.207 c2.428-1.491,4.926,1.792,2.841,3.726L123.313,180.87c-3.919,3.648-6.447,8.53-7.163,13.829l-3.798,28.146 c-0.503,3.758-5.782,4.131-6.819,0.494l-14.607-51.325C89.253,166.16,91.691,159.907,96.869,156.711z"/>
</svg>
);

const TelegramIcon = props => <Icon component={Telegram} {...props} />;

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

class RemmeProducerInfo extends Component {

  state = {
    accountDataSource: []
  }

  componentDidMount() {
    const { data } = this.props
    console.log(data);
    try {
      const accountDataSource = [
          {
            key: '0',
            name: 'Status',
            value: data.producer.is_active ? <Tag color="#4cd79c">Active</Tag> : <Tag color="#ef534f">Not active</Tag>
          },
          {
            key: '1',
            name: 'Position',
            value: `# ${data.producer.position}`
          },
          {
            key: '2',
            name: 'Votes',
            value:  `${data.producer.total_votes.toFixed(0)}`
          },
          {
            key: '8',
            name: 'Rate',
            value: `${Number(data.producer.rate.toFixed(4))} %`
          },
          {
            key: '4',
            name: 'Public Key',
            value: `${data.producer.producer_key}`
          },
          {
            key: '5',
            name: 'Location',
            value: `${data.producer.bp.org.location.country}, ${data.producer.bp.org.location.name}`
          },
          {
            key: '7',
            name: 'Nodes',
            value: `${data.producer.bp.nodes.length}`
          },
          {
            key: '6',
            name: 'Links',
            value: (
              <div className="producer-links">
                {data.producer.bp.org.website && <SmartLink id='1' link={data.producer.bp.org.website}><Icon type="link" /></SmartLink>}
                {data.producer.bp.org.social.twitter && <SmartLink id='2' link={'https://twitter.com/'+data.producer.bp.org.social.twitter}><Icon type="twitter" /></SmartLink>}
                {data.producer.bp.org.social.telegram && <SmartLink id='3' link={'https://t.me/'+data.producer.bp.org.social.telegram}><TelegramIcon/></SmartLink>}
                {data.producer.bp.org.social.facebook && <SmartLink id='4' link={'https://facebook.com/'+data.producer.bp.org.social.facebook}><Icon theme="filled" type="facebook" /></SmartLink>}
                {data.producer.bp.org.social.reddit && <SmartLink id='5' link={'https://reddit.com/user/'+data.producer.bp.org.social.reddit}><Icon theme="filled" type="reddit-circle" /></SmartLink>}
                {data.producer.bp.org.social.youtube && <SmartLink id='6' link={'https://youtube.com/'+data.producer.bp.org.social.youtube}><Icon theme="filled" type="youtube" /></SmartLink>}
                {data.producer.bp.org.social.github && <SmartLink id='7' link={'https://github.com/'+data.producer.bp.org.social.github}><Icon type="github" /></SmartLink>}
              </div>
            )
          }
        ]
        this.setState({
          producerDataSource: accountDataSource
        });
    } catch (e) {
      console.log(e.message);
      const accountDataSource = [
          {
            key: '0',
            name: 'Status',
            value: data.producer.is_active ? <Tag color="#4cd79c">Active</Tag> : <Tag color="#ef534f">Not active</Tag>
          },
          {
            key: '1',
            name: 'Position',
            value: `# ${data.producer.position}`
          },
          {
            key: '2',
            name: 'Votes',
            value:  `${data.producer.total_votes.toFixed(0)}`
          },
          {
            key: '8',
            name: 'Rate',
            value: `${Number(data.producer.rate.toFixed(4))} %`
          },
          {
            key: '4',
            name: 'Public Key',
            value: `${data.producer.producer_key}`
          }
        ]
      this.setState({
        producerDataSource: accountDataSource,
        error: true
      });
    }

  }

  render() {
    const { producerDataSource, error } = this.state;
    return (
      <React.Fragment>
        <h4>Producer info:</h4>
        { error ?
              <div>
                <Table className="producer-info details-info" dataSource={producerDataSource} columns={columns} pagination={false} />
                <Result
                  status="warning"
                  title="There are some problems with bp.json of the Block Producer."
                  extra={
                    <SmartLink link="https://github.com/eosrio/bp-info-standard">BP Information Standard</SmartLink>
                  }
                />
              </div>
             :
          <Table className="producer-info details-info" dataSource={producerDataSource} columns={columns} pagination={false} />
        }
      </React.Fragment>
    )
  }
}

export default RemmeProducerInfo;
