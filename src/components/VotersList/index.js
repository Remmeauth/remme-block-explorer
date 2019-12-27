import React from 'react'
import { Link } from 'react-router-dom';

import { Popover } from 'antd';

const content = (data, forceUpdate) => (
  <React.Fragment>
    {data.map((item, index) => {
      return <p className="small" key={index} style={{marginBottom: "0"}}><Link onClick={forceUpdate} style={{marginRight: 5}} to={'/account/' + item}>{item}</Link></p>
    })}
  </React.Fragment>
)

class VotersList extends React.Component {
  render() {
    const { data, forceUpdate } = this.props;
    const dots = data.length > 2;
    return (
      <React.Fragment>
        { data.slice(0, 2).map((item, index) => {
            return <Link key={index} style={{marginRight: 5}} to={'/account/' + item} onClick={forceUpdate}>{item}</Link>
        })}
        { dots && <Popover placement="top" content={content(data, forceUpdate)}>[ ... ]</Popover> }
      </React.Fragment>
    );
  }
}

export default VotersList;
