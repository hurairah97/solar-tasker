// import { userRequest } from "../../apiRoutes/apiRouts";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// login
export const login = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("login", data);
      return response.data;
    } catch (error) {
      // Extract error message from the backend response
      const errorMessage = error.response?.data || "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch user
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selectUser");
      return response.data.payload;
    } catch (error) {
      return rejectWithValue("Error occurred while fetching users");
    }
  }
);
// Create user
export const createUser = createAsyncThunk(
  "user/createUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("createUser", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while creating user");
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      //check if id is required here
      const response = await userRequest.post("deleteUser", id);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while deleting user");
    }
  }
);

// Reset user's password
export const passwordReset = createAsyncThunk(
  "user/passwordReset",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userRequest.post("passwordReset", data);
      return response.data;
    } catch (error) {
      return rejectWithValue("Error occurred while reseting user's password");
    }
  }
);
