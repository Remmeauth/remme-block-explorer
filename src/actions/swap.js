import { START, CANCEL } from "../types";

export const start = data => dispatch => {
  dispatch({
    type: START,
    payload: data
  })
};

export const cancel = () => dispatch => {
  dispatch({
    type: CANCEL
  })
};
