import { PayloadAction } from "@reduxjs/toolkit";
import { UserAction } from "./typing/user.enum";
import { IUser } from "./typing/user.interface";

const reducers = {
  [UserAction.SET_USER]: (state: IUser, action: PayloadAction<IUser>): void => {
    state.id = action.payload.id;
    state.fullName = action.payload.fullName;
    state.email = action.payload.email;
  },
  [UserAction.RESET_USER]: (state: IUser): void => {
    state.id = "";
    state.fullName = "";
    state.email = "";
  },
};

export default reducers;
