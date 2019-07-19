import { api } from './helpers'

export const getBlock = async (id) => {
  console.log(id);
  try {
    const chainInfo = JSON.parse(await api('POST','chain', 'get_block', '{"block_num_or_id":"' + id + '"}'));
    return chainInfo
    console.log(chainInfo);
  } catch (e) {
    console.log(e.message);

  }
}
