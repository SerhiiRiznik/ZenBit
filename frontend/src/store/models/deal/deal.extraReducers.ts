import { fetchDeals } from "./deal.thunk";
import { DealState } from "./typing/deal.interface";

export const dealExtraReducers = (builder: any) => {
  builder
    .addCase(fetchDeals.pending, (state: DealState) => {
      state.status = "loading";
    })
    .addCase(fetchDeals.fulfilled, (state: DealState, action: any) => {
      if (action.meta.arg.offset === 0) {
        state.deals = action.payload;
      } else {
        state.deals = [...state.deals, ...action.payload];
      }
      state.status = "idle";
      state.hasMore = action.payload.length > 0;
      state.offset = state.deals.length;
    })
    .addCase(fetchDeals.rejected, (state: DealState) => {
      state.status = "failed";
    });
};
