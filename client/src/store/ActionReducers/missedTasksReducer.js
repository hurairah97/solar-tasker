import { createSlice } from "@reduxjs/toolkit";
import { fetchMissedTasks } from "../ActionApis/missedTasksApi";

const upcomingTaskSlice = createSlice({
  name: "missedTask",
  initialState: {
    missedTasks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMissedTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMissedTasks.fulfilled, (state, action) => {
        state.missedTasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchMissedTasks.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default upcomingTaskSlice.reducer;
