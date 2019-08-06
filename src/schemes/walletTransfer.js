import { newAccountValidator } from './validators.js'
import { network } from '../config.js'

export const walletTransfer = [
  {
    name: 'account_name',
    label: 'to Account',
    type: 'String',
    required: true,
    message: 'Please input account name!',
    props: {
      type: 'text',
    },
    rules: {
      validator: newAccountValidator
    }
  },
  {
    name: 'amount',
    label: 'Amount ('+network.coin+')',
    type: 'String',
    required: true,
    message: 'Please input amount of coins!',
    props: {
      type: 'number',
    }
  },
  {
    name: 'memo',
    label: 'Memo',
    type: 'String',
    required: false,
    message: 'Please input memo!',
    props: {
      type: 'text',
    }
  },
];
