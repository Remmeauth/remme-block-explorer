import { api, DifferenceInDays } from '../helpers'

let count = 0;
let REWARDS = 0;

const getTotalRewards = async () => {
    console.log('\x1b[32m%s\x1b[0m', '[REWARDS DAEMON] Start');
    let sum = 0;
    let date1 = new Date();
    let date2 = date1;

    let length = 0;
    let pos = -1;
    let difference = 0;

    const forPeriodInDays = 2.2;

    do {
      const data = await api('POST','history', 'get_actions', '{"pos":"'+pos+'","offset":"-50","account_name":"rem"}');
      const actions = data.actions.reverse();
      if (!actions.length) {
        console.log('\x1b[31m%s\x1b[0m', '[REWARDS DAEMON] No actions. Check history plugin');
        return false;
      }

      if (pos === -1) {
        length = actions[0].account_action_seq;
        pos = length - 50;
      } else {
        pos = pos - 50;
      }

      difference = DifferenceInDays(date1, actions.slice(-1)[0].block_time);
      actions.forEach(i => {
        if (i.action_trace.act.name == "torewards" && DifferenceInDays(date1, i.block_time) < forPeriodInDays) {
          sum = sum + Number(i.action_trace.act.data.amount.split(' ')[0])
        }
      })
      //console.log(difference);
    } while (pos > 0 && difference < forPeriodInDays);
    console.log('\x1b[32m%s\x1b[0m', '[REWARDS DAEMON] Done:', sum);
    console.log('\x1b[32m%s\x1b[0m', '[REWARDS DAEMON] Revards per day:', sum / forPeriodInDays);
    return sum / forPeriodInDays
}

export const startRewardsDaemon = async () => {
  try {
    const total = await getTotalRewards();
    REWARDS = total;
  } catch (e) {
    console.log('\x1b[31m%s\x1b[0m', '[REWARDS DAEMON] ERROR: ', e ? e.message : e);
  }
}

export const getRewards = () => {
  return REWARDS
}
