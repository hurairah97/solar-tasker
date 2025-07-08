import { createSlice } from "@reduxjs/toolkit";
import { fetchClients } from "../ActionApis/clientApi";

const clientSlice = createSlice({
  name: "client",
  initialState: {
    clients: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.clients = action.payload;
        state.loading = false;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default clientSlice.reducer;
