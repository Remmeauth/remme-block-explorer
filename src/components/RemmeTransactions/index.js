import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import { Tag } from 'antd';

import { } from 'antd';

class RemmeTransactions extends Component {
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
        <h4>Transactions</h4>
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
                                     <div><span className="ant-table-column-title">Tx Hash</span><span className="ant-table-column-sorter"></span></div>
                                  </span>
                               </th>
                               <th className="">
                                  <span className="ant-table-header-column">
                                     <div><span className="ant-table-column-title">Action Name</span><span className="ant-table-column-sorter"></span></div>
                                  </span>
                               </th>
                               <th className="">
                                  <span className="ant-table-header-column">
                                     <div><span className="ant-table-column-title">Data</span><span className="ant-table-column-sorter"></span></div>
                                  </span>
                               </th>
                            </tr>
                          </thead>
                          <tbody className="ant-table-tbody">
                            {data.map((item) =>
                              <tr className="ant-table-row ant-table-row-level-0" key={item.trx.id} data-row-key={item.trx.id}>
                                 <td className=""><span className="ant-table-row-indent indent-level-0" ></span><Link to="/about">{item.trx.id.substring(0,10)}...</Link></td>
                                 <td className=""><Tag color="#ef534f">{item.trx.transaction.actions[0].name}</Tag></td>

                                 <td className="">{JSON.stringify(item.trx.transaction.actions[0].data).substring(0,40)}</td>
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

export default RemmeTransactions;
