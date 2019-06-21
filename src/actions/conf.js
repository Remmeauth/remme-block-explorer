import { SET, RESET } from "../types";

export const set = data => dispatch => {
  dispatch({
    type: SET,
    payload: data
  })
};

export const reset = () => dispatch => {
  dispatch({
    type: RESET
  })
};
