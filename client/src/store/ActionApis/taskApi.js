// import { userRequest } from "../../apiRoutes/apiRouts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// Fetch task
export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selecttasks");
      return response.data.payload;
    } catch (error) {
      return rejectWithValue("Error occurred while fetching tasks");
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "usertask/updateTask",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("updatetasks", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while updating task");
    }
  }
);
