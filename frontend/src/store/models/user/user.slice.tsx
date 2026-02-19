import { createSlice } from "@reduxjs/toolkit";
import reducers from "./user.reducers";
import { IUser } from "./typing/user.interface";

export const initialStateUser: IUser = {
  id: "",
  fullName: "",
  email: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialStateUser,
  reducers,
});

// Action creators are generated for each case reducer function
export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
