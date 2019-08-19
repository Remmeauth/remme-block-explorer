import { ethAddressValidator } from './validators.js'

export const ethAddress = [
  {
    name: 'eth_address',
    type: 'String',
    props: {
      type: 'text',
    },
    rules: {
      validator: ethAddressValidator
    }
  }
];
