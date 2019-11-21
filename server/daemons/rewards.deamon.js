import { api, DifferenceInDays } from '../helpers'

let count = 0;
let REWARDS = 0;

const getTotalRewards = async () => {
    console.log('\x1b[32m%s\x1b[0m', '[REWARDS DEAMON] Start');

    let sum = 0;
    let date1 = new Date();

    let before = date1.getTime();
    let after = date1.getTime() - (60*60*1000);

    let difference = 0;

    do {
      const data = JSON.parse(await api('GET','history', 'get_actions?account=rewards&limit=1000&filter=rem:torewards&after='+(new Date(after).toISOString())+'&before='+(new Date(before).toISOString()), '', 'v2'));
      if (data.actions.length) {
        const actions = data.actions.reverse();
        difference = DifferenceInDays(date1, actions.slice(-1)[0]['@timestamp']);
        actions.forEach(i => {
          sum = sum + Number(i.act.data.amount.split(' ')[0])
        })
      }

      before = before - (60*60*1000);
      after = after - (60*60*1000);
    } while (difference < 7);

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
