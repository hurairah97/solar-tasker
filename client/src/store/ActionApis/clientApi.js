// import { userRequest } from "../../apiRoutes/apiRouts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// Fetch client
export const fetchClients = createAsyncThunk(
  "client/fetchClients",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selectclients");
      return response.data.payload;
    } catch (error) {
      return rejectWithValue("Error occurred while fetching clients");
    }
  }
);
// Create client
export const createClient = createAsyncThunk(
  "client/createClient",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("createclients", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while creating client");
    }
  }
);

// Delete client
export const deleteClient = createAsyncThunk(
  "client/deleteClient",
  async (id, { rejectWithValue }) => {
    try {
      //check if id is required here
      const response = await userRequest.post("deleteclients", id);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while deleting client");
    }
  }
);

// Update client
export const updateClient = createAsyncThunk(
  "userclient/updateClient",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("updateclients", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while updating client");
    }
  }
);
