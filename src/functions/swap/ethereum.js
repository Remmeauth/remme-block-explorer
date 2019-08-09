import Web3 from 'web3';
import util from "ethereumjs-util"
import { toHex } from "web3-utils";

import { decimal, network, gasLimit, EthNetworkConfig, EthTokenAbi, EthTokenContractAddress, EthNetworkConfigWS, EthBridgeContractAddress, RemmeBridgeAbi } from "../../config";

const web3 = new Web3(new Web3.providers.HttpProvider(EthNetworkConfig));
const web3ws = new Web3(new Web3.providers.WebsocketProvider(EthNetworkConfigWS));

const token = new web3ws.eth.Contract(EthTokenAbi, EthTokenContractAddress);

export const EthGenSwapId = ( ) => {
  return 'id'
}

export const EthIsMetamask = async () => {
  try {
    await window.ethereum.enable()
    const responce = window.ethereum.isMetaMask === true
    return responce;
  } catch (e) {
    return false
  }
}

export const EthMetamaskNetwork = () => {
  try {
    const responce = Number(window.ethereum.networkVersion)
    return responce;
  } catch (e) {
    return 0
  }
}

export const EthGetBalanceEth = async ( address ) => {
  const balance = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balance);
}

const genTransaction = async ( myAddress, toAddress, data ) => {
  const count = await web3.eth.getTransactionCount(myAddress);
  const gasPrice = await web3.eth.getGasPrice();
  const rawTransaction = {
      "from": myAddress,
      "nonce": web3.utils.toHex(count),
      gasLimit: toHex(Math.ceil(gasLimit * 1.5)),
      gasPrice: toHex(Number(gasPrice) * 1.5),
      "to": toAddress,
      "value": "0x00",
      "data": data,
      "chainId": "0x00"
  };
  return JSON.stringify(rawTransaction);
}

export const EthGetBalanceRem = async ( address ) => {
  const contractInstance = new web3.eth.Contract(EthTokenAbi, EthTokenContractAddress)
  const balance = await contractInstance.methods.balanceOf(address).call()
  const decimalBalance = balance / decimal
  return decimalBalance
}

export const EthMetamaskAccountAddress = () => {
  return window.ethereum.selectedAddress
}

export const EthPrivateKeyToAddress = ( PrivateKeyEth ) => {
  if (PrivateKeyEth === "metamask") { return EthMetamaskAccountAddress(); }
  const privBuffer = new Buffer(PrivateKeyEth, 'hex');
  const PubKey = util.privateToPublic(privBuffer);
  const Address = "0x" + util.publicToAddress(PubKey).toString('hex');
  return Address
}

export const EthRawTransactionApprove = async ( amount, myAddress ) => {
  try {
    const data = token.methods.approve(EthBridgeContractAddress, amount*decimal).encodeABI();
    const responce = await genTransaction( myAddress, EthTokenContractAddress, data )
    return responce;
  } catch (e) {
    return (new Error("Approve transaction was not generated"))
  }
}

export const EthRawTransaction = async ( amount, SwapSecret, addressEth ) => {
  try {
    const contract = new web3.eth.Contract(RemmeBridgeAbi, EthBridgeContractAddress);
    console.log("RAW:");
    //console.log("0x"+network.chainId, SwapSecret[1], amount*decimal);
    //const data = await contract.methods.requestSwap("0x"+network.chainId, SwapSecret[1], amount*decimal).encodeABI();
    const data = await contract.methods.requestSwap("0x"+'1c6ae7719a2a3b4ecb19584a30ff510ba1b6ded86e1fd8b8fc22f1179c622a32', SwapSecret[1], amount*decimal).encodeABI();
    const responce = await genTransaction( addressEth, EthBridgeContractAddress, data )
    return responce;
  } catch (e) {
    return (new Error("Failed"));
  }
}

export const EthTransactionStatus = async ( transactionHash ) => {
  try {
    const trxConfirmations = await web3ws.eth.getTransactionReceipt(transactionHash)
    const block = await web3.eth.getBlock(trxConfirmations.blockNumber)
    if (trxConfirmations) {
      if (trxConfirmations.status) {
        return block.timestamp;
      } else {
        return (new Error("Failed transaction"));
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}
