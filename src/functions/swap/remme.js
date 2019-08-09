import ecc from 'eosjs-ecc'
import CryptoJS from "crypto-js";
import bigInt from "big-integer"
import moment from 'moment';

import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig';

import { network, techPrivkey, techAccount, EthReturnChainId } from '../../config'

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

export const RemSignDigest = (receiver, txid, swap_pubkey, asset, return_address, timestamp, privkey) => {
  //const digest_to_sign = receiver + "*" + txid.substring(2) + "*" + network.chainId + "*" + swap_pubkey.substring(3) + "*" + `${Number(asset).toFixed(4)} REM` + "*" + return_address.substring(2) + "*" + EthReturnChainId + "*" + timestamp
  const digest_to_sign = receiver + "*" + txid.substring(2) + "*" + '1c6ae7719a2a3b4ecb19584a30ff510ba1b6ded86e1fd8b8fc22f1179c622a32' + "*" + swap_pubkey.substring(3) + "*" + `${Number(asset).toFixed(4)} REM` + "*" + return_address.substring(2) + "*" + '0000000000000000000000000000000000000000000000000000000000000003' + "*" + timestamp
  console.log("Pub:", swap_pubkey );
  console.log("Priv:", privkey );
  console.log("digest_to_sign", digest_to_sign);
  return ecc.signHash(CryptoJS.SHA256(digest_to_sign).toString(CryptoJS.enc.Hex), privkey)
}

export const RemGenSwapId = (txid, swap_pubkey, asset, timestamp, return_address) => {
  const amount = `${Number(asset).toFixed(4)} REM`
  //const swap_str = txid.substring(2) + "*" + network.chainId + "*" + swap_pubkey.substring(3) + "*" + amount + "*" + return_address.substring(2) + "*" + EthReturnChainId + "*" + timestamp
  const swap_str = txid.substring(2) + "*" + '1c6ae7719a2a3b4ecb19584a30ff510ba1b6ded86e1fd8b8fc22f1179c622a32' + "*" + swap_pubkey.substring(3) + "*" + amount + "*" + return_address.substring(2) + "*" + EthReturnChainId + "*" + timestamp

  console.log("swap_str", swap_str);
  var hashed = CryptoJS.SHA256(swap_str);
  const result = hashed.toString(CryptoJS.enc.Hex);
  console.log("swap_id", result);
  return result
}

export const RemGetSwapInfo = async (SwapID) => {
  const cutid = bigInt(SwapID.substring(0,16), 16);
  const bound = String(cutid.value).replace('n','n');
  const response = await fetch( network.backendAddress + `/api/getSwapInfo/${bound}`);
  const json = await response.json();

  if (json.rows.length) {
    if (json.rows[0].producers.length > 1) {
      return "approved"
    }
  }
  return null
}

export const RemFinishSwap = async (receiver, txid, swap_pubkey, asset, timestamp, sig, active_pubkey, owner_pubkey, return_address) => {
  console.log("RemFinishSwap");
  const signatureProvider = new JsSignatureProvider([techPrivkey]);
  const rpc = new JsonRpc(`${network.protocol}://${network.host}:${network.port}`, { fetch });
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
  console.log("start");
  console.log({
    actions: [{
      account: 'rem.swap',
      name: 'finish',
      authorization: [{
        actor: techAccount,
        permission: 'active',
      }],
      data: {
          "receiver": receiver,
          "txid": txid.substring(2),
          "swap_pubkey_str": swap_pubkey,
          "amount": `${Number(asset).toFixed(4)} REM`,
          "return_address": return_address.substring(2),
          "return_chain_id": EthReturnChainId,
          "timestamp": moment.utc(timestamp*1000).format("YYYY-MM-DDTHH:mm:ss"),
          "sig": sig,
          //"active_pubkey": active_pubkey,
          //"owner_pubkey": owner_pubkey,
      },
    }]
  });
  const result = await api.transact({
    actions: [{
      account: 'rem.swap',
      name: 'finish',
      authorization: [{
        actor: techAccount,
        permission: 'active',
      }],
      data: {
          "receiver": receiver,
          "txid": txid.substring(2),
          "swap_pubkey_str": swap_pubkey,
          "amount": `${Number(asset).toFixed(4)} REM`,
          "return_address": return_address.substring(2),
          "return_chain_id": EthReturnChainId,
          "timestamp": moment.utc(timestamp*1000).format("YYYY-MM-DDTHH:mm:ss"),
          "sig": sig,
          //"active_pubkey": active_pubkey,
          //"owner_pubkey": owner_pubkey,
      },
    }]
  }, {
    blocksBehind: 3,
    expireSeconds: 30,
  });
  console.log(result);
  return result.transaction_id
}
