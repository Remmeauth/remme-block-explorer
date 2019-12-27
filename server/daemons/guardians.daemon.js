import { DifferenceInDays } from '../helpers'
import { getRewards } from './rewards.daemon.js'
import { getVoters } from './voters.daemon.js'

let GUARDIANS = [];

export const startGuardiansDaemon = async () => {
  try {

    const voters = getVoters();

    var now = new Date();
    var total_guardians_stake = voters.filter(item => {
      const difference = DifferenceInDays(now, item.last_reassertion_time)
      return item.staked >= 2500000000 && difference < 30;
    }).reduce((a, b) => a + Number(b.staked), 0);

    GUARDIANS = voters.sort((a, b) => {
      return b.staked - a.staked;
    }).map(item => {
      const difference = DifferenceInDays(now, item.last_reassertion_time)
      if (item.staked >= 2500000000 && difference < 30 ) {
        item.guardian = true;
        item.guardian_rate = item.staked / total_guardians_stake * 100;
        item.rewards = Number((item.staked / total_guardians_stake) * (getRewards() * 0.6));
        item.total_guardians_stake = total_guardians_stake;
      }
      return item
    })

  } catch (e) {
    console.log('\x1b[31m%s\x1b[0m', '[GUARDIANS DAEMON] ERROR: ', e ? e.message : e);
  }
}

export const getGuardians = () => {
  return GUARDIANS.filter(item => {return item.guardian});
}
