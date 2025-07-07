// import { userRequest } from "../../apiRoutes/apiRouts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// Fetch team
export const fetchTeams = createAsyncThunk(
  "team/fetchTeams",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selectteams");
      return response.data.payload;
    } catch (error) {
      return rejectWithValue("Error occurred while fetching teams");
    }
  }
);
// Create team
export const createTeam = createAsyncThunk(
  "team/createTeam",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("createteams", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while creating team");
    }
  }
);

// Delete team
export const deleteTeam = createAsyncThunk(
  "team/deleteTeam",
  async (id, { rejectWithValue }) => {
    try {
      //check if id is required here
      const response = await userRequest.post("deleteteams", id);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while deleting team");
    }
  }
);

// Update team
export const updateTeam = createAsyncThunk(
  "userteam/updateTeam",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("updateteams", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while updating team");
    }
  }
);
