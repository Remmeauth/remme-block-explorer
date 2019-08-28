import { api } from '../helpers'
import { network } from '../../config'
import { getGlobalInfo } from './global.deamon.js'

let PRODUCERS_LIST = [];

const calculateEosFromVotes = (votes) => {
    let sec_since_epoch = +new Date() / 1000 - 946684800;
    let weight = sec_since_epoch / 604800 / 52; // 604800 = seconds in week
    return votes / (2 ** weight) / 10000;
};

// const calculateTotalVotes = (global, supply) => {
//     this.chainPercentage = (global.total_activated_stake / 10000 / supply * 100).toFixed(2);
//     this.chainNumber = global.total_activated_stake / supply * 100000;
// }

export const startProducersDeamon = async () => {
    try {
      const global = getGlobalInfo();

      const blockInfo = JSON.parse(await api('POST','chain', 'get_table_rows', '{ "json": true, "code": "'+network.account+'", "scope": "'+network.account+'", "table": "producers", "limit": "500" }' ));

      let result = [];
      let data = blockInfo.rows;

      if(!data){
        return;
      }

      data.sort((a, b) => {
          return b.total_votes - a.total_votes;
      }).forEach((elem, index) => {
          let eos_votes = calculateEosFromVotes(elem.total_votes);
          elem.all_votes = elem.total_votes;
          elem.rate = (elem.all_votes / global.total_producer_vote_weight * 100).toLocaleString();
          elem.total_votes = Number(eos_votes).toLocaleString();
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
