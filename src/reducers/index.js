import { combineReducers } from "redux";

import conf from "./conf";
import auth from "./auth";
import swap from "./swap";

export default combineReducers({
  conf,
  auth,
  swap
});
