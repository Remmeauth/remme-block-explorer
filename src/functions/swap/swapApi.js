import {
  RemSignDigest,
  RemGetSwapInfo,
  EthRawTransaction,
  EthTransactionStatus,
  EthRawTransactionApprove,
  RemRandomKeys,
  RemGenSwapId,
  RemFinishSwap,
  EthStartSwap
} from '../swap';

export const taskList = {
  0: [
  {
    id: "SwapSecret",
    title: "Create Secret",
    exeption: "SwapSecret was not generated"
  },
  {
    id: "SwapRawTransactionApprove",
    title: "Create Swap Approve Transaction",
    exeption: "Swap Approve Transaction was not generated"
  },
  {
   id: "SwapTransactionApprove",
   title: "Send Swap Approve Transaction",
   exeption: "Swap Approve Transaction was not sent"
  },
  {
   id: "SwapTransactionApproveStatus",
   title: "Waiting for Swap Approve Transaction",
   exeption: "Swap Approve Transaction error"
  },
  {
    id: "SwapRawTransaction",
    title: "Create Swap Request Transaction",
    exeption: "Swap Transaction was not generated"
  },
  {
    id: "SwapTransaction",
    title: "Signing Swap Request Transaction",
    exeption: "Swap Transaction was not sent"
  },
  {
    id: "SwapTransactionStatus",
    title: "Waiting for Swap Request to be mined",
    exeption: "Swap Transaction error"
  },
  {
    id: "SwapSignDigest",
    title: "Signing Digest",
    exeption: "Error"
  },
  {
    id: "SwapID",
    title: "Composing Swap Identifier",
    exeption: "SwapId was not generated"
  },
  {
    id: "SwapWait",
    title: "Waiting for producers to approve",
    exeption: "Error"
  },
  {
    id: "SwapFinalize",
    title: "Finalizing Swap on REMChain",
    exeption: "Error"
  }
  ],
  1: [
    { // REM
      id: "SwapTransaction",
      title: "Create Swap Transaction",
      exeption: "Swap Transaction error"
    },
  ]
}

export const doSwapTask = async (current, props, callback) => {
  const { id, exeption } = taskList[props.type][current];
  if (props[id]) {
    callback(null, props[id]);
  } else {
    try {
      const response = await actions[props.type][id](props);
      if (response instanceof Error) {
        callback(response.message)
      } else {
        callback(null, response)
      }
    } catch (e) {
      callback(exeption)
    }
  }
}

const actions = {
  0: {
    SwapSecret: async () => {
      return await RemRandomKeys();
    },
    SwapRawTransactionApprove: async ({ amount, addressEth }) => {
      return await EthRawTransactionApprove( amount, addressEth )
    },
    SwapTransactionApprove: async ({ SwapRawTransactionApprove, PrivateKeyEth, addressEth }) => {
      if (PrivateKeyEth === "metamask") {
        return new Promise((resolve, reject) => {
          window.web3.eth.sendTransaction(JSON.parse(SwapRawTransactionApprove), function(err, transactionHash) {
            if (err) {reject(new Error(err.message));}
            else {resolve(transactionHash);}
          })
        });
      }
    },
    SwapTransactionApproveStatus: async ({ SwapTransactionApprove }) => {
      return await EthTransactionStatus( SwapTransactionApprove )
    },
    SwapRawTransaction: async ({ amount, SwapSecret, addressEth }) => {
      return await EthRawTransaction( amount, SwapSecret, addressEth )
    },
    SwapTransaction: async ({ SwapRawTransaction, PrivateKeyEth, addressEth }) => {
      if (PrivateKeyEth === "metamask") {
        return new Promise((resolve, reject) => {
          window.web3.eth.sendTransaction(JSON.parse(SwapRawTransaction), function(err, transactionHash) {
            console.log(err);
            if (err) {reject(new Error(err.message));}
            else {resolve(transactionHash);}
          })
        });
      }
    },
    SwapTransactionStatus: async ({ SwapTransaction }) => {
      return await EthTransactionStatus( SwapTransaction )
    },

    SwapSignDigest: ({ AccountNameRem, SwapTransaction, SwapSecret, amount, addressEth, SwapTransactionStatus, ActiveKeyRem, OwnerKeyRem  }) => {
      return RemSignDigest( AccountNameRem, SwapTransaction, SwapSecret[1], amount, addressEth, SwapTransactionStatus, SwapSecret[0], ActiveKeyRem, OwnerKeyRem)
    },

    SwapID: ({ SwapTransaction, SwapSecret, amount, SwapTransactionStatus, addressEth }) => {
      return RemGenSwapId( SwapTransaction, SwapSecret[1], amount, SwapTransactionStatus, addressEth )
    },
    SwapWait: async ({SwapID}) => {
      return await RemGetSwapInfo(SwapID);
    },
    SwapFinalize: async ({AccountNameRem, SwapTransaction, SwapSecret, amount, SwapTransactionStatus, SwapSignDigest, ActiveKeyRem, OwnerKeyRem, addressEth }) => {
      return await RemFinishSwap(AccountNameRem, SwapTransaction, SwapSecret[1], amount, SwapTransactionStatus, SwapSignDigest, ActiveKeyRem, OwnerKeyRem, addressEth);
    }
  },

  1: {
    SwapTransaction: async ({ AccountNameRem, amount, addressEth }) => {
      return await EthStartSwap(AccountNameRem, amount, addressEth);
    },
  }
}
