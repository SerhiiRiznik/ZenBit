import { createAsyncThunk } from "@reduxjs/toolkit";
import { Deal } from "./typing/deal.interface";
import axios from "axios";
import { api } from "../../../api";

export const fetchDeals = createAsyncThunk<
  Deal[],
  { limit: number; offset: number }
>("deal/fetchDeals", async ({ limit, offset }) => {
  const response = await api.get<Deal[]>(
    `/applications?limit=${limit}&offset=${offset}`,
  );
  return response.data;
});
