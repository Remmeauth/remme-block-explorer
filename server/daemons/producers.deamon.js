import { api } from '../helpers'
import { network } from '../../config'
import { getGlobalInfo } from './global.deamon.js'

let PRODUCERS_LIST = [];

const calculateEosFromVotes = (votes) => {
    let sec_since_epoch = +new Date() / 1000 - 946684800;
    let weight = parseInt(`${ sec_since_epoch / (86400 * 7) }`, 10) / 52; // 604800 = seconds in week
    return votes / (2 ** weight) / 10000;
};

const countRewards = (total_votes, index, totalProducerVoteWeight, votesToRemove) => {
  let position = index;
  let reward = 0;
  let percentageVotesRewarded = total_votes / (totalProducerVoteWeight - votesToRemove) * 100;

   if (position < 22) {
     reward += 318;
   }
   reward += percentageVotesRewarded * 200;
   if (reward < 100) {
     reward = 0;
   }
   return Math.floor(reward).toLocaleString();
}

export const startProducersDeamon = async () => {
    try {
      const global = getGlobalInfo();
      const blockInfo = JSON.parse(await api('POST','chain', 'get_table_rows', '{ "json": true, "code": "'+network.account+'", "scope": "'+network.account+'", "table": "producers", "limit": "1000" }' ));
      let result = [];
      let data = blockInfo.rows.sort((a, b) => {
          return b.total_votes - a.total_votes;
      });

      const votesToRemove = data.reduce((acc, cur) => {
        const percentageVotes = cur.all_votes / global.total_producer_vote_weight * 100;
        if (percentageVotes * 200 < 100) {
          acc += parseFloat(cur.all_votes);
        }
        return acc;
      }, 0);

      data.forEach((elem, index) => {
          let eos_votes = calculateEosFromVotes(elem.total_votes);
          elem.index   = index + 1;
          elem.all_votes = elem.total_votes;
          elem.total_votes = Number(eos_votes).toLocaleString();
          result.push(elem);
      });
      result = countRate(result, global.total_producer_vote_weight)
      PRODUCERS_LIST = result;
    } catch (e) {
      console.log('\x1b[31m%s\x1b[0m', '[PRODUCER DEAMON] ERROR: ', e.message);
    }
}

const countRate = (data, totalProducerVoteWeight) => {
    if(!data){
      return;
    }
    const votesToRemove = data.reduce((acc, cur) => {
      const percentageVotes = cur.all_votes / totalProducerVoteWeight * 100;
      if (percentageVotes * 200 < 100) {
        acc += parseFloat(cur.all_votes);
      }
      return acc;
    }, 0);
    data.forEach((elem, index) => {
      elem.index   = index + 1;
      elem.rate    = (elem.all_votes / totalProducerVoteWeight * 100).toLocaleString();
      elem.rewards = `${ countRewards(elem.all_votes, elem.index, totalProducerVoteWeight, votesToRemove) } ${network.coin}`;
    });
    return data;
}

export const getProducerList = () => {
  return PRODUCERS_LIST;
}
