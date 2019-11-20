import { api, DifferenceInDays } from '../helpers'

let count = 0;
let REWARDS = 0;

const getTotalRewards = async () => {
    console.log('\x1b[32m%s\x1b[0m', '[REWARDS DEAMON] Start');
    let sum = 0;
    let date1 = new Date();
    let date2 = date1;

    let skip = 0;
    let difference = 0;

    do {
      const data = JSON.parse(await api('GET','history', 'get_actions?account=rewards&limit=1000&filter=rem:torewards&sort=-1&skip='+skip, '', 'v2'));
      const actions = data.actions.reverse();

      skip = skip + 1000

      difference = DifferenceInDays(date1, actions.slice(-1)[0]['@timestamp']);
      actions.forEach(i => {

      sum = sum + Number(i.act.data.amount.split(' ')[0])
      })

    } while (difference < 4);
    console.log('\x1b[32m%s\x1b[0m', '[REWARDS DEAMON] Done:', sum);
    return sum / 4
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
