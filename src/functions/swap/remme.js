import ecc from 'eosjs-ecc'
import CryptoJS from "crypto-js";
import bigInt from "big-integer"
import moment from 'moment';

import { Api, JsonRpc, RpcError } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

import { network, techPrivkey, techAccount } from '../../config'

export const RemPrivateKeyToAddress = ( PrivateKeyRem ) => {
  return PrivateKeyRem
}

export const RemGetBalanceRem = ( addressRem ) => {
  return 0
}

export const RemRandomKeys = async () => {
  const privateKey = await ecc.randomKey();
  const publicKey = ecc.privateToPublic(privateKey);
  return [privateKey, publicKey]
}


export const RemSignDigest = (receiver, active_pubkey, owner_pubkey, privkey) => {
  const digest_to_sign = (receiver + "*" + active_pubkey.substring(3) + "*" + owner_pubkey.substring(3))
  return ecc.signHash(CryptoJS.SHA256(digest_to_sign).toString(CryptoJS.enc.Hex), privkey)
}

export const RemGenSwapId = (txid, swap_pubkey, asset, timestamp) => {
  const amount = `${Number(asset).toFixed(4)} REM`
  const swap_str = txid + "*" + network.chainId + "*" + swap_pubkey.substring(3) + "*" + amount + "*" + timestamp
  var hashed = CryptoJS.SHA256(swap_str);
  const result = hashed.toString(CryptoJS.enc.Hex);
  return result
}

export const RemGetSwapInfo = async (SwapID) => {
  const cutid = bigInt(SwapID.substring(0,16), 16);
  const bound = String(cutid.value).replace('n','n');
  const response = await fetch( network.backendAddress + `/api/getSwapInfo/${bound}`);
  const json = await response.json();

  if (json.rows.length) {
    if (json.rows[0].producers.length > 1) {
      console.log("1");
      return "approved"
    }
  }
  return null
}

export const RemFinishSwap = async (receiver, txid, swap_pubkey, asset, timestamp, sig, active_pubkey, owner_pubkey) => {
  const signatureProvider = new JsSignatureProvider([techPrivkey]);
  const rpc = new JsonRpc(network.host, { fetch });
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  const result = await api.transact({
    actions: [{
      account: 'remio.swap',
      name: 'finishswap',
      authorization: [{
        actor: techAccount,
        permission: 'active',
      }],
      data: {
          "receiver": receiver,
          "txid": txid,
          "chain_id": network.chainId,
          "swap_pubkey_str": swap_pubkey,
          "amount": `${Number(asset).toFixed(4)} REM`,
          "timestamp": moment.utc(timestamp*1000).format("YYYY-MM-DDTHH:mm:ss"),
          "sig": sig,
          "active_pubkey": active_pubkey,
          "owner_pubkey": owner_pubkey,
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  return result.transaction_id
}
