import { combineReducers } from "redux";
import authSlice from "./models/auth/auth.slice";
import userSlice from "./models/user/user.slice";
import dealsSlice from "./models/deal/deal.slice";

export const rootReducer = combineReducers({
  user: userSlice,
  authorization: authSlice,
  deals: dealsSlice,
});
