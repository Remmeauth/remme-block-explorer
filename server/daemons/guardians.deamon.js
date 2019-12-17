import { api, DifferenceInDays } from '../helpers'
import { network } from '../../config'
import { getRewards } from './rewards.deamon.js'

let VOTERS = [];
let GUARDIANS = [];


export const startGuardiansDeamon = async () => {
  try {
    var voters = [];
    var more = true;
    var limit = 50;
    var lower_bound = "";

    do {
      const guardiansInfo = await api('POST','chain', 'get_table_rows', '{ "pos":"1", "lower_bound":"'+lower_bound+'", "json": true, "code": "'+network.account+'", "scope": "'+network.account+'", "table": "voters", "limit": "'+limit+'" }' );

      if (!guardiansInfo.rows.length) {
        console.log('\x1b[31m%s\x1b[0m', '[GUARDIANS DEAMON] No voters. Check history plugin');
        return false;
      }

      more = guardiansInfo.more;
      lower_bound = guardiansInfo.rows.slice(-1).pop()['owner'];

      if (more) {
        guardiansInfo.rows.pop()
        voters = voters.concat(guardiansInfo.rows);
      } else {
        voters = voters.concat(guardiansInfo.rows);
      }
    } while (more);

    VOTERS = voters;

    var now = new Date();
    var total_guardians_stake = voters.filter(item => {
      const difference = DifferenceInDays(now, item.last_reassertion_time)
      return item.staked >= 2500000000 && difference < 30;
    }).reduce((a, b) => a + Number(b.staked), 0);

    GUARDIANS = VOTERS.sort((a, b) => {
      return b.staked - a.staked;
    }).map(item => {
      const difference = DifferenceInDays(now, item.last_reassertion_time)
      if (item.staked >= 2500000000 && difference < 30 ) {
        item.guardian = true;
        item.guardian_rate = item.staked / total_guardians_stake * 1;
        item.rewards = Number(item.guardian_rate * (getRewards() * 0.6));
        item.total_guardians_stake = total_guardians_stake;
      }
      return item
    })

  } catch (e) {
    console.log('\x1b[31m%s\x1b[0m', '[GUARDIANS DEAMON] ERROR: ', e.message);
  }
}

export const getVoterInfo = (id) => {
  return VOTERS.filter(item => {return item.owner === id});
}

export const getGuardians = () => {
  return GUARDIANS.filter(item => {return item.guardian});
}
