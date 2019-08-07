import { network } from '../config.js'

export const walletStake = [
  {
    name: 'amount',
    label: 'Amount ('+network.coin+')',
    type: 'String',
    required: true,
    message: 'Please input amount of coins!',
    props: {
      type: 'number',
    }
  }
];
