import { api } from '../helpers'
import { network } from '../../config'

let PRODUCERS_LIST = [];

const calculateEosFromVotes = (votes) => {
    let date = +new Date() / 1000 - 946684800;
    let weight = parseInt(`${ date / (86400 * 7) }`, 10) / 52; // 86400 = seconds per day 24*3600
    let tes = votes / (2 ** weight) / 10000
    return tes;
};

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
          let eos_votes = Math.floor(calculateEosFromVotes(elem.total_votes));
          elem.all_votes = elem.total_votes;
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
