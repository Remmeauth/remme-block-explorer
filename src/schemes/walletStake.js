export const walletStake = [
  {
    name: 'amount',
    label: `Amount (${process.env.REACT_APP_SYSTEM_COIN})`,
    type: 'String',
    required: true,
    message: 'Please input amount of coins!',
    props: {
      type: 'number',
    }
  }
];
