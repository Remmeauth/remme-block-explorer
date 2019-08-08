import { api } from '../helpers'
import { network } from '../../config'

const ungerKey = "EOS1111111111111111111111111111111114T1Anm";
let PRODUCERS_LIST = [];

export const startProducersDeamon = async () => {
    try {
      const blockInfo = JSON.parse(await api('POST','chain', 'get_table_rows', '{ "json": true, "code": "'+network.account+'", "scope": "'+network.account+'", "table": "producers", "limit": "500" }' ));
      let result = [];
      let data = blockInfo.rows;

      if(!data){
        return;
      }
      data.sort((a, b) => {
          return b.total_votes - a.total_votes;
      }).forEach((elem, index) => {
          if (elem.producer_key === ungerKey){
              return;
          }
          result.push(elem);
      });
      PRODUCERS_LIST = result;
    } catch (e) {
      console.log('\x1b[31m%s\x1b[0m', '[PRODUCER DEAMON] ERROR: ', e.message);
    }
}

export const getProducerList = () => {
  return PRODUCERS_LIST;
}
