import React, { Component } from 'react';
import QueueAnim from 'rc-queue-anim';

import { Table, Divider, Tag } from 'antd';

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

  columns = [
  {
    title: 'Tx Hash',
    dataIndex: 'tx',
    key: 'tx',
    render: text => <a href="javascript:;">{text}</a>,
  },
  {
    title: 'Action Name',
    dataIndex: 'action',
    key: 'action',
  },
  {
    title: 'Data',
    dataIndex: 'data',
    key: 'data',
  }
];

  data = [
  {
    key: '1',
    tx: '1b980f52fefdef499',
    action: 'transfer',
    data: '3',
  },
  {
    key: '2',
    tx: '1b980f52fefdef499',
    action: 'transfer',
    data: '2',
  },
  {
    key: '3',
    tx: '1b980f52fefdef499',
    action: 'transfer',
    data: '1',
  },
];

  render() {
    const {show} = this.state
    return (
      <React.Fragment>
        <h4>Transactions</h4>
        { show && <div className="ant-table-wrapper">
         <div className="ant-spin-nested-loading">
            <div className="ant-spin-container">
               <div className="ant-table ant-table-default ant-table-scroll-position-left">
                  <div className="ant-table-content">
                     <div className="ant-table-body">
                        <table className="">
                           <thead className="ant-table-thead">
                              <tr>
                                 <th className="">
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
                            <QueueAnim type="right" component="tbody" className="ant-table-tbody">
                              <tr className="ant-table-row ant-table-row-level-0" key="1" data-row-key="1">
                                 <td className=""><span className="ant-table-row-indent indent-level-0" ></span><a href="javascript:;">1b980f52fefdef499</a></td>
                                 <td className="">transfer</td>
                                 <td className="">3</td>
                              </tr>
                              <tr className="ant-table-row ant-table-row-level-0" key="2" data-row-key="2">
                                 <td className=""><span className="ant-table-row-indent indent-level-0" ></span><a href="javascript:;">1b980f52fefdef499</a></td>
                                 <td className="">transfer</td>
                                 <td className="">2</td>
                              </tr>
                              <tr className="ant-table-row ant-table-row-level-0" key="3" data-row-key="3">
                                 <td className=""><span className="ant-table-row-indent indent-level-0" ></span><a href="javascript:;">1b980f52fefdef499</a></td>
                                 <td className="">transfer</td>
                                 <td className="">1</td>
                              </tr>
                            </QueueAnim>
                        </table>
                     </div>
                  </div>
               </div>
            </div>
         </div>
        </div>}
      </React.Fragment>

    )
  }
}

export default RemmeTransactions;
