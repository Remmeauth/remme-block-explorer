import { api } from '../helpers'
import { network } from '../../config'
import { getGlobalInfo } from './global.deamon.js'
import { getRewards } from './rewards.deamon.js'

let PRODUCERS_LIST = [];

export const startProducersDeamon = async () => {
    try {
      const global = getGlobalInfo();
      const producersList = await api('POST','chain', 'get_table_rows', '{ "json": true, "code": "'+network.account+'", "scope": "'+network.account+'", "table": "producers", "limit": "1000" }' );
      const sortedProducers = producersList.rows.filter(item => item.is_active ).sort((a, b) => {
          return b.total_votes - a.total_votes;
      });
      PRODUCERS_LIST = countRate(sortedProducers, global.total_producer_vote_weight)
    } catch (e) {
      console.log('\x1b[31m%s\x1b[0m', '[PRODUCER DEAMON] ERROR: ', e ? e.message : e);
    }
}

const countRate = (producers, totalProducerVoteWeight) => {
   const global = getGlobalInfo();
   return producers.map((elem, index) => {
      const active = global.last_schedule.filter(item => {return item.first === elem.owner});
      const rotated =  global.standby.filter(item => {return item.first === elem.owner});
      if (active.length || rotated.length) {
        elem.tag = active.length ? 'Active' : 'Rotated'
      } else {
        elem.tag = 'Standby'
      }
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
