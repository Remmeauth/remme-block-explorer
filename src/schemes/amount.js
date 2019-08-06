export const amount = ({ amountValidator }) => [
  {
    name: 'amount',
    type: 'String',
    required: true,
    message: 'Please input amount of coins!',
    props: {
      type: 'number',
    },
    rules: {
      validator: amountValidator
    }
  }
];
