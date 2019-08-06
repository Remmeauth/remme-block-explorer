import { newAccountValidator } from './validators.js'

export const existingAccount = [
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
  }
];
