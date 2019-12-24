import Web3 from 'web3';
import util from "ethereumjs-util"

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ETH_INFURA_LINK));
const web3ws = new Web3(new Web3.providers.WebsocketProvider(process.env.REACT_APP_ETH_INFURA_WS_LINK));

const token = new web3ws.eth.Contract(JSON.parse(process.env.REACT_APP_ETH_TOKEN_ABI), process.env.REACT_APP_ETH_TOKEN_CONTRACT);

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
  const rawTransaction = {
      "from": myAddress,
      "nonce": web3.utils.toHex(count),
      "to": toAddress,
      "gas": 500000,
      "gasPrice": 20000000000,
      "value": "0x00",
      "data": data,
      "chainId": "0x00"
  };
  return JSON.stringify(rawTransaction);
}

export const EthGetBalanceRem = async ( address ) => {
  const contractInstance = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_ETH_TOKEN_ABI), process.env.REACT_APP_ETH_TOKEN_CONTRACT)
  const balance = await contractInstance.methods.balanceOf(address).call()
  const decimalBalance = balance / process.env.REACT_APP_SYSTEM_COIN_DECIMAL
  return decimalBalance
}

export const EthMetamaskAccountAddress = () => {
  return window.ethereum.selectedAddress
}

export const EthPrivateKeyToAddress = async ( PrivateKeyEth ) => {
  if (PrivateKeyEth === "metamask") { return EthMetamaskAccountAddress(); }
  if(await web3.utils.isAddress(PrivateKeyEth)) { return PrivateKeyEth;}
  const privBuffer = new Buffer(PrivateKeyEth, 'hex');
  const PubKey = util.privateToPublic(privBuffer);
  const Address = "0x" + util.publicToAddress(PubKey).toString('hex');
  return Address
}

export const EthRawTransactionApprove = async ( amount, myAddress ) => {
  try {
    const data = token.methods.approve(process.env.REACT_APP_ETH_BRIDGE_CONTRACT, amount*process.env.REACT_APP_SYSTEM_COIN_DECIMAL).encodeABI();
    const responce = await genTransaction( myAddress, process.env.REACT_APP_ETH_TOKEN_CONTRACT, data )
    return responce;
  } catch (e) {
    return (new Error("Approve transaction was not generated"))
  }
}

export const EthRawTransaction = async ( amount, SwapSecret, addressEth ) => {
  try {
    const contract = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_ETH_BRIDGE_ABI), process.env.REACT_APP_ETH_BRIDGE_CONTRACT);
    const data = await contract.methods.requestSwap("0x"+process.env.REACT_APP_NETWORK_CHAIN_ID, SwapSecret[1], amount*process.env.REACT_APP_SYSTEM_COIN_DECIMAL).encodeABI();
    const responce = await genTransaction( addressEth, process.env.REACT_APP_ETH_BRIDGE_CONTRACT, data )
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
