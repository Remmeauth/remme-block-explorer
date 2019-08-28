import { api } from '../helpers'
import { network } from '../../config'

let GLOBAL_INFO = [];

export const startGlobalDeamon = async () => {
  try {
    const globalInfo = JSON.parse(await api('POST','chain', 'get_table_rows', '{ "json": true, "code": "'+network.account+'", "scope": "'+network.account+'", "table": "global", "limit": "1" }' ));
    GLOBAL_INFO = globalInfo.rows[0];
  } catch (e) {
    console.log('\x1b[31m%s\x1b[0m', '[GLOBAL DEAMON] ERROR: ', e.message);
  }
}

export const getGlobalInfo = () => {
  return GLOBAL_INFO;
}
