import { createSlice } from "@reduxjs/toolkit";
import { fetchWorkers } from "../ActionApis/workerApi";

const workerSlice = createSlice({
  name: "worker",
  initialState: {
    workers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkers.fulfilled, (state, action) => {
        state.workers = action.payload;
        state.loading = false;
      })
      .addCase(fetchWorkers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default workerSlice.reducer;
