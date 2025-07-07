import { createSlice } from "@reduxjs/toolkit";
import { fetchRegions } from "../ActionApis/regionApi";

const regionSlice = createSlice({
  name: "region",
  initialState: {
    regions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.regions = action.payload;
        state.loading = false;
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default regionSlice.reducer;
