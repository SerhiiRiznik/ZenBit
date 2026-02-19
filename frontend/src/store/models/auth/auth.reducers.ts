import { PayloadAction } from "@reduxjs/toolkit";
import { AuthAction } from "./typing/auth.enum";
import { IAuth } from "./typing/auth.interface";

const reducers = {
  [AuthAction.SET_AUTH_STATE]: (
    state: IAuth,
    action: PayloadAction<Partial<IAuth>>,
  ): void => {
    Object.assign(state, action.payload);
  },
  [AuthAction.RESET_AUTH_STATE]: (state: IAuth): void => {
    state.status = "idle";
    state.error = null;
    state.token = null;
  },
};

export default reducers;
