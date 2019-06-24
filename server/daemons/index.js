import { sleep } from '../helpers'
import { startBlocksDeamon } from './blocks.deamon.js'

export const getInfo = () => {
  return {test: 'test'}
}

export const startDaemons = async () => {
  await startBlocksDeamon();

  await sleep(10);
  startDaemons();
}
