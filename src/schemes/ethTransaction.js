import { ethTXValidator } from './validators.js'

export const ethTransaction = [
  {
    name: 'eth_address',
    type: 'String',
    props: {
      type: 'text',
    },
    rules: {
      validator: ethTXValidator
    }
  }
];
