import { api, producerInfo } from './helpers'
import { getInfo } from './daemons'

const ToInt = 10000;

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

export const getActions = async (id) => {
  try {
    const chainInfo = JSON.parse(await api('POST','history', 'get_actions', '{"pos":"-1","offset":"-50","account_name":"'+id+'"}'));
    return chainInfo
  } catch (e) {
    console.log(e.message);
  }
}

export const getProducer = async (url) => {
  try {
    const bp = JSON.parse(await producerInfo(url + "/bp.json"));
    return bp;
  } catch (e) {
    console.log(e);
    return {}
  }
}


const round = (value, decimals) => {
 return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

const calcBalance = (account, balance) => {
  let accInfo = {
    staked: 0,
    unstaked: 0,
    total_balance: 0,
    balance: []
  };
  try {
    if (account && account.voter_info && account.voter_info.staked){
      accInfo.staked = account.voter_info.staked / ToInt;
    }
    accInfo.balance = Array.isArray(balance) ? balance : [];
    accInfo.balance.forEach((elem) => {
      if (elem.indexOf('EOS') !== -1){
        accInfo.unstaked = !isNaN(Number(elem.split(' ')[0])) ? Number(elem.split(' ')[0]) : 0;
      }
    });

    const total_resources = Number(account.total_resources.cpu_weight.split(' ')[0]) + Number(account.total_resources.net_weight.split(' ')[0]);
    const self_delegated_bandwidth = account.self_delegated_bandwidth ? (Number(account.self_delegated_bandwidth.cpu_weight.split(' ')[0]) + Number(account.self_delegated_bandwidth.net_weight.split(' ')[0])) : accInfo.staked;
    accInfo.staked_by_others = round(total_resources - self_delegated_bandwidth, 4)
    accInfo.total_balance = round(accInfo.unstaked + accInfo.staked, 4)
    return accInfo;
  } catch (e) {
    console.log(e.message);
    return accInfo
  }
}

export const getAccount = async (id) => {
  try {
    const chainInfo = getInfo();
    let accountInfo = {};
    accountInfo.marketChart = chainInfo.marketChart;
    accountInfo.account = JSON.parse(await api('POST','chain', 'get_account', '{"account_name":"' + id + '"}'));
    //let actionsInfo = JSON.parse(await api('POST','history', 'get_actions', '{"pos":"-1","offset":"-20","account_name":"' + id + '"}'));
    const balanceInfo = JSON.parse(await api('POST','chain', 'get_currency_balance', '{"code":"eosio.token", "account":"'+id+'"}'));
    accountInfo.balance = calcBalance(accountInfo.account, balanceInfo);
    accountInfo.balance.total_usd_value = (accountInfo.balance.total_balance * accountInfo.marketChart.prices[0].y).toFixed(2)
    //accountInfo.actions = actionsInfo;
    for (var i = 0; i < chainInfo.producers.length; i++){
      if (chainInfo.producers[i].owner === accountInfo.account.account_name){
         accountInfo.producer = chainInfo.producers[i];
         accountInfo.producer.position = i+1;
      }
    }
    if (accountInfo.producer) {
      accountInfo.producer.bp = await getProducer(accountInfo.producer.url);
    }

    return accountInfo
  } catch (e) {
    console.log(e.message);
    return {}
  }
}
