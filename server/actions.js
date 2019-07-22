import { api } from './helpers'

export const getBlock = async (id) => {
  try {
    const chainInfo = JSON.parse(await api('POST','chain', 'get_block', '{"block_num_or_id":"' + id + '"}'));
    return chainInfo
  } catch (e) {
    console.log(e.message);
  }
}

export const getTransaction = async (id) => {
  try {
    const chainInfo = JSON.parse(await api('POST','history', 'get_transaction', '{"id":"' + id + '"}'));
    return chainInfo
  } catch (e) {
    console.log(e.message);
  }
}
