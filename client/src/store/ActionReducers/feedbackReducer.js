import { createSlice } from "@reduxjs/toolkit";
import { fetchFeedbacks } from "../ActionApis/feedbackApi";

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbacks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.feedbacks = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default feedbackSlice.reducer;
