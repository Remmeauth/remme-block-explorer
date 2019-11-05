import moment from 'moment';

import { coinmarketcap } from '../helpers'

let count = 0;
let last_elements = -20;
let MARKET_CHART = {}

const arrFilter = (arr) => {
  return arr.slice(1).slice(last_elements).map((item) => {
    return {
      x: moment(new Date(item[0])).format('HH:mm'),
      y: item[1] > 1 ? Number(item[1].toFixed(0)) : Number(item[1].toFixed(6))
    }
  });
}

const scale = (arr) => {
  var max = 0;
  var min = 10000000000000000000;

  arr.forEach(function(item, i, arr) {
    if (max < item.y) { max = item.y }
    if (min > item.y) { min = item.y }
  });

  return {
    "y":{
      min: min,
      max: max
    },
  }
}

export const startMarketDeamon = async () => {
  try {
    if (!count) {
      const info = JSON.parse(await coinmarketcap());
      MARKET_CHART.prices = arrFilter(info.prices);
      MARKET_CHART.prices_scale = scale(MARKET_CHART.prices);
      MARKET_CHART.market_caps = arrFilter(info.market_caps);
      MARKET_CHART.market_caps_scale = scale(MARKET_CHART.market_caps);
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
