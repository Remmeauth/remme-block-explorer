import {
  RemSignDigest,
  RemGetSwapInfo,
  EthRawTransaction,
  EthTransactionStatus,
  EthRawTransactionApprove,
  RemRandomKeys,
  RemGenSwapId,
  RemFinishSwap
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
   title: "Check Swap Approve Transaction",
   exeption: "Swap Approve Transaction error"
  },
  {
    id: "SwapRawTransaction",
    title: "Create Swap Transaction",
    exeption: "Swap Transaction was not generated"
  },
  {
    id: "SwapTransaction",
    title: "Send Swap Transaction",
    exeption: "Swap Transaction was not sent"
  },
  {
    id: "SwapTransactionStatus",
    title: "Check Swap Transaction",
    exeption: "Swap Transaction error"
  },
  {
    id: "SwapSignDigest",
    title: "Sign Digest",
    exeption: "Error"
  },
  {
    id: "SwapID",
    title: "Create SwapId",
    exeption: "SwapId was not generated"
  },
  {
    id: "SwapWait",
    title: "Wait for swap",
    exeption: "Error"
  },
  {
    id: "SwapFinish",
    title: "Finish swap",
    exeption: "Error"
  }
  ],
  1: [{ // REM
    id: "SwapId",
    title: "Create SwapId",
    exeption: "SwapId was not generated"
  },
  ]
}

export const doSwapTask = async (current, props, callback) => {
  const { type }         = props;
  const { id, exeption } = taskList[type][current];
  if (props[id]) {
    callback(null, props[id]);
  } else {
    try {
      const responce = await actions[type][id](props);
      callback(null, responce)
    } catch (e) {
      console.log(e.message);
      callback(new Error(exeption))
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
            if (err) {reject(new Error(err));}
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
            if (err) {reject(new Error(err));}
            else {resolve(transactionHash);}
          })
        });
      }
    },
    SwapTransactionStatus: async ({ SwapTransaction }) => {
      return await EthTransactionStatus( SwapTransaction )
    },

    SwapSignDigest: ({ AccountNameRem, SwapTransaction, SwapSecret, amount, addressEth, SwapTransactionStatus  }) => {
      return RemSignDigest( AccountNameRem, SwapTransaction, SwapSecret[1], amount, addressEth, SwapTransactionStatus, SwapSecret[0])
    },

    SwapID: ({ SwapTransaction, SwapSecret, amount, SwapTransactionStatus, addressEth }) => {
      return RemGenSwapId( SwapTransaction, SwapSecret[1], amount, SwapTransactionStatus, addressEth )
    },
    SwapWait: async ({SwapID}) => {
      return await RemGetSwapInfo(SwapID);
    },
    SwapFinish: async ({AccountNameRem, SwapTransaction, SwapSecret, amount, SwapTransactionStatus, SwapSignDigest, ActiveKeyRem, OwnerKeyRem, addressEth }) => {
      return await RemFinishSwap(AccountNameRem, SwapTransaction, SwapSecret[1], amount, SwapTransactionStatus, SwapSignDigest, ActiveKeyRem, OwnerKeyRem, addressEth);
    }
  },

  1: {
    SwapId: () => {
      return "11";
    },
    // SwapSecret: () => {
    //   return randomHex(8);
    // },
    // SwapRawTransaction: async ({ amount, addressEth, SwapId, SwapSecret }) => {
    //   return await RemRawTransactionSwap( amount, addressEth, SwapId, SwapSecret )
    // },
    // SwapTransaction: async ({ SwapId, type, SwapRawTransaction, PrivateKeyRem, amount, addressEth, NodeSwap }) => {
    //   return await RemTransactionSwap(PrivateKeyRem, SwapRawTransaction, NodeSwap);
    // },
    // SwapApproveTransaction: ({ SwapTransaction, SwapId, type, SwapRawTransaction, PrivateKeyRem, amount, addressEth }) => {
    //   return new Promise((resolve, reject) => {
    //     request.post(backendUrl,{
    //       json:    { SwapId, type, key: PrivateKeyRem, amount, addressEth, SwapTransaction }
    //     }, function(error, response, body){
    //       if (error) {
    //         resolve(null)
    //       } else {
    //         try {
    //           if (body.status === 2) { resolve(null) }
    //           else if (body.status === 1) { resolve(body.message) }
    //           else { reject(new Error("Swap was not approved")) }
    //         } catch (e) {
    //           reject(new Error(e.message))
    //         }
    //       }
    //     });
    //   });
    // }
  }
}
