import { api, DifferenceInDays } from '../helpers'

let count = 0;
let REWARDS = 0;

const getTotalRewards = async () => {
    console.log('\x1b[32m%s\x1b[0m', '[REWARDS DEAMON] Start');
    let sum = 0;
    let date1 = new Date();
    let date2 = date1;

    let length = 0;
    let pos = -1;
    let difference = 0;

    do {
      const data = await api('POST','history', 'get_actions', '{"pos":"'+pos+'","offset":"-1000","account_name":"rewards"}');
      const actions = data.actions.reverse();

      if (pos === -1) {
        length = actions[0].account_action_seq;
        pos = length - 1000;
      } else {
        pos = pos - 1000;
      }

      difference = DifferenceInDays(date1, actions.slice(-1)[0].block_time);
      actions.forEach(i => {
        if (i.action_trace.act.name == "torewards" && DifferenceInDays(date1, i.block_time) < 7) {
          sum = sum + Number(i.action_trace.act.data.amount.split(' ')[0])
        }
      })
      console.log(difference);
    } while (pos > 0 && difference < 7);
    console.log('\x1b[32m%s\x1b[0m', '[REWARDS DEAMON] Done:', sum);
    return sum / 7
}

export const startRewardsDeamon = async () => {
  try {
    const total = await getTotalRewards();
    REWARDS = total;
  } catch (e) {
    console.log('\x1b[31m%s\x1b[0m', '[REWARDS DEAMON] ERROR: ', e.message);
  }
}

export const getRewards = () => {
  return REWARDS
}
