import { PayloadAction } from "@reduxjs/toolkit";
import { Deal, DealState } from "./typing/deal.interface";

const dealReducers = {
  setDeals(state: DealState, action: PayloadAction<Deal[]>) {
    state.deals = action.payload;
  },
  appendDeals(state: DealState, action: PayloadAction<Deal[]>) {
    state.deals = [...state.deals, ...action.payload];
  },
  setStatus(
    state: DealState,
    action: PayloadAction<"idle" | "loading" | "failed">,
  ) {
    state.status = action.payload;
  },
  setOffset(state: DealState, action: PayloadAction<number>) {
    state.offset = action.payload;
  },
  setHasMore(state: DealState, action: PayloadAction<boolean>) {
    state.hasMore = action.payload;
  },
  resetDeals(state: DealState) {
    state.deals = [];
    state.offset = 0;
    state.hasMore = true;
    state.status = "idle";
  },
};

export default dealReducers;
