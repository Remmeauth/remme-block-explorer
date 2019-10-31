import { api } from '../helpers'
import { network } from '../../config'
import { getGlobalInfo } from './global.deamon.js'
import { getRewards } from './rewards.deamon.js'

let PRODUCERS_LIST = [];

export const startProducersDeamon = async () => {
    try {
      const global = getGlobalInfo();
      const blockInfo = JSON.parse(await api('POST','chain', 'get_table_rows', '{ "json": true, "code": "'+network.account+'", "scope": "'+network.account+'", "table": "producers", "limit": "1000" }' ));
      const sortedProducers = blockInfo.rows.sort((a, b) => {
          return b.total_votes - a.total_votes;
      });
      PRODUCERS_LIST = countRate(sortedProducers, global.total_producer_vote_weight)
    } catch (e) {
      console.log('\x1b[31m%s\x1b[0m', '[PRODUCER DEAMON] ERROR: ', e.message);
    }
}

const countRate = (producers, totalProducerVoteWeight) => {
   return producers.map((elem, index) => {
      elem.total_votes = Number(elem.total_votes)
      elem.index   = index + 1;
      elem.rate    = Number(elem.total_votes / totalProducerVoteWeight * 100);
      elem.rewards = Number((elem.total_votes / totalProducerVoteWeight ) * (getRewards() * 0.3));
      return elem;
    });
}

export const getProducerList = () => {
  return PRODUCERS_LIST;
}
