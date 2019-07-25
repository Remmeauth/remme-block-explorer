import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import { Tag } from 'antd';
import numeral from 'numeral';

class RemmeProducers extends Component {
  state = {
    show: false,
  }

  componentDidMount() {
    const {wait} = this.props
    setTimeout(
      function() {
          this.setState({ show: true });
      }.bind(this)
    , wait);
  }

  render() {
    const { show } = this.state;
    const { data } = this.props;
    return (
      <React.Fragment>
        <h4>Producers</h4>
        { show && <QueueAnim type="right">
        <div key="1" className="ant-table-wrapper">
         <div className="ant-spin-nested-loading">
            <div className="ant-spin-container">
               <div className="ant-table ant-table-default ant-table-scroll-position-left">
                  <div className="ant-table-content" style={{overflow: "hidden"}}>
                     <div className="ant-table-body">
                        <table className="">
                          <thead className="ant-table-thead">
                            <tr>
                              <th>
                                 <span className="ant-table-header-column">
                                    <div><span className="ant-table-column-title">#</span><span className="ant-table-column-sorter"></span></div>
                                 </span>
                              </th>
                               <th>
                                  <span className="ant-table-header-column">
                                     <div><span className="ant-table-column-title">Name</span><span className="ant-table-column-sorter"></span></div>
                                  </span>
                               </th>
                               <th className="">
                                  <span className="ant-table-header-column">
                                     <div><span className="ant-table-column-title">Status</span><span className="ant-table-column-sorter"></span></div>
                                  </span>
                               </th>
                               <th className="">
                                  <span className="ant-table-header-column">
                                     <div><span className="ant-table-column-title">Total votes</span><span className="ant-table-column-sorter"></span></div>
                                  </span>
                               </th>
                            </tr>
                          </thead>
                          <tbody className="ant-table-tbody">
                            {data.slice(0, 30).map((item, index) =>
                              <tr className="ant-table-row ant-table-row-level-0" key={index} data-row-key={index}>
                                 <td className="">{ index + 1 }</td>
                                 <td className=""><Link to={'/account/' + item.owner}>{ item.owner }</Link></td>
                                 <td className="">{index < 21 ? <Tag color="#4cd79c">TOP 21</Tag> : <Tag color="#f9b22b">Standby</Tag>}</td>
                                 <td className="">{numeral(item.total_votes).format('0,0')}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
         </div>
        </div>
        </QueueAnim>
      }
      </React.Fragment>

    )
  }
}

export default RemmeProducers;
