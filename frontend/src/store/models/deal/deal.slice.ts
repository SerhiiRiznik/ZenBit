import { createSlice } from "@reduxjs/toolkit";
import { DealState } from "./typing/deal.interface";
import reducers from "./deal.reducers";
import { fetchDeals } from "./deal.thunk";
import { dealExtraReducers } from "./deal.extraReducers";

const initialState: DealState = {
  deals: [],
  status: "idle",
  offset: 0,
  hasMore: true,
};

const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers,
  extraReducers: dealExtraReducers,
});

export const {
  setDeals,
  appendDeals,
  setStatus,
  setOffset,
  setHasMore,
  resetDeals,
} = dealSlice.actions;
export default dealSlice.reducer;
