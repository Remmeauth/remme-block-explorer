import { sleep } from '../helpers'
import { startBlocksDeamon, getBlockList } from './blocks.deamon.js'
import { startMarketDeamon, getMarketChart } from './market.deamon.js'
import { startTransactionsDeamon, getTransactionList } from './transactions.deamon.js'
import { startProducersDeamon, getProducerList } from './producers.deamon.js'
import { startGlobalDeamon, getGlobalInfo } from './global.deamon.js'
import { startRewardsDeamon, getRewards } from './rewards.deamon.js'

let infoData = {};

const prepareData = () => {
  try {
    infoData.marketChart = getMarketChart();
    infoData.totalBlocks = getBlockList()[0].block_num;
    infoData.producer = getBlockList()[0].producer;
    infoData.transactions = getTransactionList();
    infoData.producers = getProducerList();
    infoData.global = getGlobalInfo();
    infoData.rewardsPerDay = getRewards();
    infoData.blocks = getBlockList().map( (item) => {
      return {
        id: item.id,
        block_num: item.block_num,
        producer: item.producer,
        timestamp: item.timestamp,
        transactions: item.transactions.length
      }
    });
  } catch (e) {
    console.log(e.message);
    infoData = {}
  }

}

export const getInfo = () => {
  return infoData;
}

export const startDaemons = async () => {
  await startBlocksDeamon();
  await startMarketDeamon();
  await startTransactionsDeamon();
  await startProducersDeamon();
  await startGlobalDeamon();
  prepareData();
  await sleep(1000);
  startDaemons();
}

export const startRewardsDaemon = async () => {
  await startRewardsDeamon();
  await sleep(1000 * 60 * 60); //1h
  startRewardsDaemon();
}
