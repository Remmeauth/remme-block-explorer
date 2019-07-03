import moment from 'moment';

import { coinmarketcap } from '../helpers'

let count = 0;
let last_elements = -20;
let MARKET_CHART = {}

const arrFilter = (arr) => {
  return arr.slice(1).slice(last_elements).map( (item) => {
    return {
      x: moment(new Date(item[0])).format('HH:mm'),
      y: item[1]
    }
  });
}

export const startMarketDeamon = async () => {
  try {
    if (!count) {
      const info = JSON.parse(await coinmarketcap());
      const prices = arrFilter(info.prices);
      const market_caps = arrFilter(info.market_caps);
      MARKET_CHART.prices = prices;
      MARKET_CHART.market_caps = market_caps;
    }
    count++
    if (count == 5) count = 0;
  } catch (e) {
    console.log('\x1b[31m%s\x1b[0m', '[MARKET DEAMON] ERROR: ', e.message);
  }
}

export const getMarketChart = () => {
  return MARKET_CHART
}
