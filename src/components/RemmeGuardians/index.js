import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';

import { network, decimal } from '../../config.js'

class RemmeGuardians extends Component {
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
    const { data, size } = this.props;
    console.log(data);
    return (
      <React.Fragment>
        { show && <QueueAnim type="right">
        <h4>Guardians</h4>
        <div key="1" className="ant-table-wrapper">
         <div className="ant-spin-nested-loading">
            <div className="ant-spin-container">
               <div className="ant-table ant-table-default ant-table-scroll-position-left">
                  <div className="ant-table-content" style={{overflow: "hidden"}}>
                     <div className="ant-table-body">
                       <div className="scroll-table-1">
                        <div className="scroll-table-2">
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
                                 <th>
                                    <span className="ant-table-header-column">
                                       <div><span className="ant-table-column-title">Staked</span><span className="ant-table-column-sorter"></span></div>
                                    </span>
                                 </th>
                                 <th>
                                    <span className="ant-table-header-column">
                                       <div><span className="ant-table-column-title">Rate</span><span className="ant-table-column-sorter"></span></div>
                                    </span>
                                 </th>
                                 <th>
                                    <span className="ant-table-header-column">
                                       <div><span className="ant-table-column-title">Rewards (per day)</span><span className="ant-table-column-sorter"></span></div>
                                    </span>
                                 </th>
                              </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                              {data.slice(0, size).map((item, index) =>
                                <tr className="ant-table-row ant-table-row-level-0" key={index} data-row-key={index}>
                                   <td className="">{ index + 1 }</td>
                                   <td className=""><Link to={'/account/' + item.owner}>{ item.owner }</Link></td>
                                   <td className="">{ item.staked / decimal } {network.coin}</td>
                                   <td className="">{ Number(item.guardian_rate.toFixed(4)) }</td>
                                   <td className="">{item.rewards.toFixed(0)}</td>
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
         </div>
        </div>
        </QueueAnim>
      }
      </React.Fragment>

    )
  }
}

export default RemmeGuardians;
