import ecc from 'eosjs-ecc'
import CryptoJS from "crypto-js";
import moment from 'moment';
import ScatterJS from '@scatterjs/core';
import ScatterEOS from '@scatterjs/eosjs2';

import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

import {
    network,
    techPrivkey,
    techAccount,
    EthReturnChainId,
} from '../../config';

ScatterJS.plugins( new ScatterEOS() );
const net = ScatterJS.Network.fromJson(network);
const rpc = new JsonRpc(net.fullhost());
const eos = ScatterJS.eos(net, Api, {rpc});

const formatSwapIdToLittleEnd = (str) => {
    let le = '';
    const p128 = str.match(/.{1,32}/g);
    p128.forEach((hash) => {
        const bytes = hash.match(/.{1,2}/g);
        bytes.reverse();
        le += bytes.join('');
    });
    return le;
}

export const RemPrivateKeyToAddress = ( PrivateKeyRem ) => {
  return PrivateKeyRem
}

export const RemGetBalanceRem = async ( addressRem ) => {
    try{
        const res = await fetch(`${network.backendAddress}/api/getAccount/${addressRem}`);
        const json = await res.json();
        if(json.hasOwnProperty('account') && json.hasOwnProperty('balance')){
            return json.balance.unstaked;
        }else{
            return 0;
        }
    }catch (e) {
        return 0;
    }
}

export const RemRandomKeys = async () => {
  const privateKey = await ecc.randomKey();
  const publicKey = ecc.privateToPublic(privateKey);
  return [privateKey, publicKey]
}

export const RemSignDigest = (receiver, txid, swap_pubkey, asset, return_address, timestamp, privkey, active_pubkey, owner_pubkey) => {
  const pubKeys = ((active_pubkey && owner_pubkey) ? owner_pubkey + "*" + active_pubkey + "*" : '')
  const digest_to_sign = `${receiver}*${pubKeys}${txid.substring(2)}*${network.chainId}*${Number(asset).toFixed(4)} REM*${return_address.substring(2)}*${EthReturnChainId}*${timestamp}`
  return ecc.signHash(CryptoJS.SHA256(digest_to_sign).toString(CryptoJS.enc.Hex), privkey)
}

export const RemGenSwapId = (txid, swap_pubkey, asset, timestamp, return_address) => {
  const swap_str = `${swap_pubkey.substring(3)}*${txid.substring(2)}*${network.chainId}*${Number(asset).toFixed(4)} REM*${return_address.substring(2)}*${EthReturnChainId}*${timestamp}`
  const hashed = CryptoJS.SHA256(swap_str);
  const result = hashed.toString(CryptoJS.enc.Hex);
  return result
}

export const RemGetSwapInfo = async (SwapID) => {
  const le = formatSwapIdToLittleEnd(SwapID);
  const response = await fetch( network.backendAddress + `/api/getSwapInfo/${le}`);
  const json = await response.json();
  console.log(json);
  if (json.hasOwnProperty('rows') && json.rows.length) {
    if (json.rows[0].status === 1) {
      return "approved"
    }
  }
  return null
}

export const RemGetSwapFee = async (SwapID) => {
  const response = await fetch( network.backendAddress + `/api/getSwapFee`);
  const json = await response.json();
  return Number(json)
}

export const RemGetAccountCreatingFee = async (SwapID) => {
  const response = await fetch( network.backendAddress + `/api/getInfo`);
  const json = await response.json();
  return json.global.min_account_stake / 10000
}

export const RemFinishSwap = async (receiver, txid, swap_pubkey, asset, timestamp, sig, active_pubkey, owner_pubkey, return_address) => {
  const signatureProvider = new JsSignatureProvider([techPrivkey]);
  const rpc = new JsonRpc(`${network.protocol}://${network.host}:${network.port}`, { fetch });
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  const data = {
      "rampayer": techAccount,
      "receiver": receiver,
      "txid": txid.substring(2),
      "swap_pubkey_str": swap_pubkey,
      "quantity": `${Number(asset).toFixed(4)} REM`,
      "return_address": return_address.substring(2),
      "return_chain_id": EthReturnChainId,
      "swap_timestamp": moment.utc(timestamp*1000).format("YYYY-MM-DDTHH:mm:ss"),
      "sign": sig
  };
  if(active_pubkey && owner_pubkey){
      data['active_pubkey_str'] = active_pubkey;
      data['owner_pubkey_str'] = owner_pubkey;
  }

  const result = await api.transact({
    actions: [{
      account: 'rem.swap',
      name: data.hasOwnProperty('active_pubkey_str') ? 'finishnewacc' : 'finish',
      authorization: [{
        actor: techAccount,
        permission: 'bot',
      }],
      data,
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result.transaction_id
}

export const EthStartSwap = async (AccountNameRem, amount, addressEth) => {
    const connected = await ScatterJS.connect(network.account, {net});
    if (!connected) return false;
    const scatter = ScatterJS.scatter;

    await scatter.getIdentity({accounts: [net]});
    const account = scatter.identity.accounts.find(x => x.blockchain === net.blockchain);
    const trx = await eos.transact({
        actions: [{
            account: 'rem.token',
            name: 'transfer',
            authorization: [{
                actor: AccountNameRem,
                permission: account.authority,
            }],
            data: {
                from: account.name,
                to: 'rem.swap',
                quantity: Number(amount).toFixed(4) + ` ${network.coin}`,
                memo:  EthReturnChainId + ' ' + addressEth,
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
    return trx.transaction_id;
}
