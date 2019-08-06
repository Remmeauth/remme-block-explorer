import { newAccountValidator, pubKeyValidator } from './validators.js'

export const newAccount = [
  {
    name: 'account_name',
    label: 'Account name',
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
    name: 'owner_key',
    label: 'Owner key',
    type: 'String',
    required: true,
    message: 'Please input Owner Public Key!',
    props: {
      type: 'text',
    },
    rules: {
      validator: pubKeyValidator
    }

  },
  {
    name: 'active_key',
    label: 'Active key',
    type: 'String',
    required: true,
    message: 'Please input Active Public Key!',
    props: {
      type: 'text',
    },
    rules: {
      validator: pubKeyValidator
    }
  }
];
