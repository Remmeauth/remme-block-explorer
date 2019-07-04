import { sleep } from '../helpers'
import { startBlocksDeamon, getBlockList } from './blocks.deamon.js'
import { startMarketDeamon, getMarketChart } from './market.deamon.js'
import { startTransactionsDeamon, getTransactionList } from './transactions.deamon.js'

let infoData = {};

const prepareData = () => {
  infoData.marketChart = getMarketChart();
  infoData.totalBlocks = getBlockList()[0].block_num;
  infoData.producer = getBlockList()[0].producer;
  infoData.transactions = getTransactionList();
  infoData.blocks = getBlockList().map( (item) => {
    return {
      id: item.id,
      block_num: item.block_num,
      producer: item.producer,
      timestamp: item.timestamp,
      transactions: item.transactions.length
    }
  });
}

export const getInfo = () => {
  return infoData;
}

export const startDaemons = async () => {
  await startBlocksDeamon();
  await startMarketDeamon();
  await startTransactionsDeamon();
  prepareData();
  await sleep(1000);
  startDaemons();
}
