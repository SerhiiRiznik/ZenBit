import { createSlice } from "@reduxjs/toolkit";
import reducers from "./auth.reducers";
import { IAuth } from "./typing/auth.interface";
import { login, logout, registration } from "./auth.thunk";

const initialState: IAuth = {
  status: "idle",
  error: null,
  token: null,
};

export const authSlice = createSlice({
  name: "authorization",
  initialState,
  reducers,
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.token = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Unexpected error.";
      })
      .addCase(registration.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.token = action.payload.accessToken;
      })
      .addCase(registration.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Unexpected error.";
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.error = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state) => {
        state.status = "idle";
        state.error = null;
        state.token = null;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setAuthState, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
