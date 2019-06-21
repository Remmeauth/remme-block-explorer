import { SET, RESET } from '../types';

const initialState = {
  nightMode: false,
};

const handleSet = (state, { nightMode }) => ({
  nightMode
});

const handleReset = () => initialState;

const handlers = {
  [SET]: handleSet,
  [RESET]: handleReset,
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  return handler ? handler(state, action.payload) : state;
};
