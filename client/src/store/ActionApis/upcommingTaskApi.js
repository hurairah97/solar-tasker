import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// Fetch upcomiingTask
export const fetchUpcommingTasks = createAsyncThunk(
  "task/fetchupcommingaTask",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selectupcomingtasks");
      console.log(response)
      return response.data.payload;

    } catch (error) {
      return rejectWithValue("Error occurred while fetching teams");
    }
  }
);

// Delete upcomingTask
export const deleteUpcomingTask = createAsyncThunk(
  "upcomingTask/deleteUpcomingTask",
  async (id, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("deletetupcomingasks", id);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while deleting upcoming task");
    }
  }
);

// Update upcomingTask
export const updateUpcomingTask = createAsyncThunk(
  "userupcomingTask/updateUpcomingTask",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("updateupcomingtasks", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while updating upcoming task");
    }
  }
);