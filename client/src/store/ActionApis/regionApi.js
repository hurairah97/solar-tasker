// import { userRequest } from "../../apiRoutes/apiRouts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// Fetch region
export const fetchRegions = createAsyncThunk(
  "region/fetchRegions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selectarea_region");
      return response.data.payload;
    } catch (error) {
      return rejectWithValue("Error occurred while fetching regions");
    }
  }
);
// Create region
export const createRegion = createAsyncThunk(
  "region/createRegion",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("createarea_region", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while creating region");
    }
  }
);

// Delete region
export const deleteRegion = createAsyncThunk(
  "region/deleteRegion",
  async (id, { rejectWithValue }) => {
    try {
      //check if id is required here
      const response = await userRequest.post("deletearea_region", id);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while deleting region");
    }
  }
);

// Update region
export const updateRegion = createAsyncThunk(
  "userregion/updateRegion",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("updatearea_region", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while updating region");
    }
  }
);
