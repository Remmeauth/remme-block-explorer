import { api } from '../helpers'

let GLOBAL_INFO = [];

export const startGlobalDaemon = async () => {
  try {
    const globalInfo = await api(`POST`,`chain`, `get_table_rows`, `{ "json": true, "code": "${process.env.REACT_APP_SYSTEM_ACCOUNT}", "scope": "${process.env.REACT_APP_SYSTEM_ACCOUNT}", "table": "global", "limit": "1" }` );
    GLOBAL_INFO = globalInfo.rows[0];
  } catch (e) {
    console.log(`\x1b[31m%s\x1b[0m`, `[GLOBAL DAEMON] ERROR: `, e ? e.message : e);
  }
}

export const getGlobalInfo = () => {
  return GLOBAL_INFO;
}
