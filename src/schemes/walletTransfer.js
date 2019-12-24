import { newAccountValidator } from './validators.js'

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
    label: `Amount (${process.env.REACT_APP_SYSTEM_COIN})`,
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
