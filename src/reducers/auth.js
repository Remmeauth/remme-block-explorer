import { LOGIN, LOGOUT } from '../types';

const initialState = {
  PrivateKeyRem: false,
  PrivateKeyEth: false,
  AccountNameRem: false,
  OwnerKeyRem: false,
  ActiveKeyRem: false,
  SwapInitiated: false,
  amount: false,
  type: false,
  addressEth: false,
  addressRem: false,
  balanceRemRem: false,
  balanceEthRem: false,
  balanceEthEth: false
};

const handleLogin = (
  state,
  {
    PrivateKeyRem,
    PrivateKeyEth,
    AccountNameRem,
    OwnerKeyRem,
    ActiveKeyRem,
    SwapInitiated,
    amount,
    type,
    addressEth,
    addressRem,
    balanceRemRem,
    balanceEthRem,
    balanceEthEth
  }) => ({
    PrivateKeyRem,
    PrivateKeyEth,
    AccountNameRem,
    OwnerKeyRem,
    ActiveKeyRem,
    SwapInitiated,
    amount,
    type,
    addressEth,
    addressRem,
    balanceRemRem,
    balanceEthRem,
    balanceEthEth,
});

const handleLogout = () => initialState;

const handlers = {
  [LOGIN]: handleLogin,
  [LOGOUT]: handleLogout,
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  return handler ? handler(state, action.payload) : state;
};
