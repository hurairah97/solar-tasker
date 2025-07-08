import { createSlice } from "@reduxjs/toolkit";
import { fetchTeams } from "../ActionApis/teamApi";

const teamSlice = createSlice({
  name: "team",
  initialState: {
    teams: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default teamSlice.reducer;
