import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// Fetch missingTask
export const fetchMissedTasks = createAsyncThunk(
  "task/fetchupcommingaTask",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selectmissedtasks");
      console.log(response)
      return response.data.payload;

    } catch (error) {
      return rejectWithValue("Error occurred while fetching teams");
    }
  }
);

// Delete missedTask
export const deleteMissedTask = createAsyncThunk(
  "missedTask/deleteMissedTask",
  async (id, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("deletetmissedtasks", id);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while deleting missed task");
    }
  }
);

// Update missedTask
export const updateMissedTask = createAsyncThunk(
  "usermissedTask/updateMissedTask",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("updatetmissedtasks", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while updating missed task");
    }
  }
);