import { createSlice } from "@reduxjs/toolkit";
import { fetchLiveTrackings } from "../ActionApis/liveTrackingApi";

const liveTrackingSlice = createSlice({
  name: "liveTracking",
  initialState: {
    liveTrackings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveTrackings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLiveTrackings.fulfilled, (state, action) => {
        state.liveTrackings = action.payload;
        state.loading = false;
      })
      .addCase(fetchLiveTrackings.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default liveTrackingSlice.reducer;
