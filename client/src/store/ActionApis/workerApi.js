// import { userRequest } from "../../apiRoutes/apiRouts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// Fetch worker
export const fetchWorkers = createAsyncThunk(
  "worker/fetchWorkers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selectworker");
      return response.data.payload;
    } catch (error) {
      return rejectWithValue("Error occurred while fetching workers");
    }
  }
);
// Create worker
export const createWorker = createAsyncThunk(
  "worker/createWorker",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("createworkers", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while creating worker");
    }
  }
);

// Delete worker
export const deleteWorker = createAsyncThunk(
  "worker/deleteWorker",
  async (id, { rejectWithValue }) => {
    try {
      //check if id is required here
      const response = await userRequest.post("deleteworkers", id);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while deleting worker");
    }
  }
);

// Update worker
export const updateWorker = createAsyncThunk(
  "userworker/updateWorker",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("updateworkers", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while updating worker");
    }
  }
);
