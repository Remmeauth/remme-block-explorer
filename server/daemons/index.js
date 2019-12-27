import { sleep } from '../helpers'
import { startBlocksDaemon, getBlockList } from './blocks.daemon.js'
import { startMarketDaemon, getMarketChart } from './market.daemon.js'
import { startTransactionsDaemon, getTransactionList } from './transactions.daemon.js'
import { startProducersDaemon, getProducerList } from './producers.daemon.js'
import { startGlobalDaemon, getGlobalInfo } from './global.daemon.js'
import { startRewardsDaemon, getRewards } from './rewards.daemon.js'
import { startGuardiansDaemon, getGuardians } from './guardians.daemon.js'
import { startVotersDaemon } from './voters.daemon.js'

let infoData = {};

const prepareData = () => {
  try {
    infoData.marketChart = getMarketChart();
    infoData.totalBlocks = getBlockList()[0].block_num;
    infoData.producer = getBlockList()[0].producer;
    infoData.transactions = getTransactionList();
    infoData.global = getGlobalInfo();
    infoData.guardians = getGuardians().length
    infoData.producers = getProducerList();
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
  await startGlobalDaemon();
  await startBlocksDaemon();
  await startMarketDaemon();
  await startTransactionsDaemon();
  await startProducersDaemon();
  prepareData();
  await sleep(1000);
  startDaemons();
}

export const startSlowDaemons = async () => {
  await startRewardsDaemon();
  await startVotersDaemon();
  await startGuardiansDaemon();
  await sleep(1000 * 15 * 60); //15m
  startSlowDaemons();
}
