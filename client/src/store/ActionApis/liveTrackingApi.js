// import { userRequest } from "../../apiRoutes/apiRouts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// Fetch liveTracking
export const fetchLiveTrackings = createAsyncThunk(
  "liveTracking/fetchLiveTrackings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selectlivetracking");
      return response.data.payload?.result;
    } catch (error) {
      return rejectWithValue("Error occurred while fetching live trackings");
    }
  }
);