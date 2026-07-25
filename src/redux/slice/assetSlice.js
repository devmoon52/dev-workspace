import { createSlice } from "@reduxjs/toolkit";
import { transfers } from "../../data/listData";

const initialState = {
  current_revenue: 3800,
  total_asset: 500,
  recent_withdrawls: transfers,
};

const assetSlice = createSlice({
  initialState,
  name: "asset",
  reducers: {
    updateRevenue: (state, action) => {
      state.current_revenue = action.payload;
    },
    updateAsset: (state, action) => {
      state.total_asset = action.payload;
    },
    // add new withdrawls
    addNewWithdrawl: (state, action) => {
      const obj = action.payload;

      const now = new Date();

      state.recent_withdrawls.unshift({
        id: Date.now(),
        ...obj,
        date: `${now.getDate()}/${now.getMonth() + 1}`,
      });
    },
  },
});

export const {
  updateAsset,
  updateRevenue,
  addNewWithdrawl,
} = assetSlice.actions;
export default assetSlice.reducer;
