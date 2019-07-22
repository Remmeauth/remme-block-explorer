import { api, producerInfo } from './helpers'
import { getInfo } from './daemons'

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

export const getProducer = async (id) => {
  try {
    const chainInfo = getInfo();
    for (var i = 0; i < chainInfo.producers.length; i++){
      if (chainInfo.producers[i].owner === id){
         const bp = JSON.parse(await producerInfo(chainInfo.producers[i].url + "/bp.json"));
         bp.account = chainInfo.producers[i];
         bp.producer_position = i+1;
         return bp
      }
    }
    return false
  } catch (e) {
    console.log(e.message);
  }
}
