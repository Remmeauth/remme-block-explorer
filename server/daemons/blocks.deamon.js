import { api } from '../helpers'

let NEW_BLOCKS = [];
let BLOCK_LIST = [];

export const startBlocksDeamon = async () => {
  try {
    NEW_BLOCKS = [];
    const chainInfo = JSON.parse(await api('POST','chain', 'get_info'));
    const blockExist = BLOCK_LIST.find(block => block.block_num == chainInfo.head_block_num);
    if (blockExist) {
      return false;
    }
    const blockInfo = JSON.parse(await api('POST', 'chain', 'get_block', '{"block_num_or_id":"' + chainInfo.head_block_num + '"}'));
    NEW_BLOCKS.push(blockInfo);

    for (var i = 0; i < 7; i++) {
      const lastItem = NEW_BLOCKS.slice(-1)[0];
      const newBlockNum = lastItem.block_num - 1;
      const alreadyExist = BLOCK_LIST.find(block => block.block_num == newBlockNum);

      if (alreadyExist) {
        break;
      } else {
        const newBlockInfo = JSON.parse(await api('POST', 'chain', 'get_block', '{"block_num_or_id":"' + newBlockNum + '"}'));
        NEW_BLOCKS.push(newBlockInfo);
      }
    }
    BLOCK_LIST = NEW_BLOCKS.concat(BLOCK_LIST);
    BLOCK_LIST = BLOCK_LIST.slice(0, 8);
  } catch (e) {
    console.log('\x1b[31m%s\x1b[0m', '[BLOCKS DEAMON] ERROR: ', e.message);
  }
}

export const getBlockList = () => {
  return BLOCK_LIST
}

export const getNewBlockList = () => {
  return NEW_BLOCKS
}
