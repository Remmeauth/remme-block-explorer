import { sleep } from '../helpers'
import { startBlocksDeamon, getBlockList } from './blocks.deamon.js'

let infoData = {}

const prepareData = () => {
  infoData.totalBlocks = getBlockList()[0].block_num;
  infoData.producer = getBlockList()[0].producer;
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
  prepareData();
  await sleep(10);
  startDaemons();
}
