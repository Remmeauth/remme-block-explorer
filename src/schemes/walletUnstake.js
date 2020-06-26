import { newAccountValidator } from './validators.js'

export const walletUnstake = [
  {
    name: 'owner',
    label: 'Owner',
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
