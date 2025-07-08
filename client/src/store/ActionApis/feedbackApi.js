// import { userRequest } from "../../apiRoutes/apiRouts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// Fetch feedback
export const fetchFeedbacks = createAsyncThunk(
  "feedback/fetchFeedbacks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selectfeedbacks");
      return response.data.payload.result;
    } catch (error) {
      return rejectWithValue("Error occurred while fetching feedbacks");
    }
  }
);