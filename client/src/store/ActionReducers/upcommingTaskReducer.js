import { createSlice } from "@reduxjs/toolkit";
import { fetchUpcommingTasks } from "../ActionApis/upcommingTaskApi";

const upcomingTaskSlice = createSlice({
  name: "upcommingTask",
  initialState: {
    upcommingTasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcommingTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpcommingTasks.fulfilled, (state, action) => {
        state.upcommingTasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchUpcommingTasks.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default upcomingTaskSlice.reducer;
