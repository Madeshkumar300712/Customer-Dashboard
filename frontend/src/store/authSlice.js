import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const loginUser = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.login(data);
    localStorage.setItem("hx_token", res.data.token);
    localStorage.setItem("hx_user",  JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Login failed"); }
});

export const registerUser = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await api.register(data);
    localStorage.setItem("hx_token", res.data.token);
    localStorage.setItem("hx_user",  JSON.stringify(res.data.user));
    return res.data.user;
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Registration failed"); }
});

const stored = localStorage.getItem("hx_user");
const parsedUser = stored && stored !== "undefined" ? JSON.parse(stored) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: { user: parsedUser, loading: false, error: null },
  reducers: {
    logout: (s) => {
      localStorage.removeItem("hx_token"); localStorage.removeItem("hx_user");
      s.user = null;
    },
    clearError: (s) => { s.error = null; },
  },
  extraReducers: (b) => {
    b.addCase(loginUser.pending,    (s) => { s.loading = true; s.error = null; });
    b.addCase(loginUser.fulfilled,  (s, a) => { s.user = a.payload; s.loading = false; });
    b.addCase(loginUser.rejected,   (s, a) => { s.loading = false; s.error = a.payload; });
    b.addCase(registerUser.pending,   (s) => { s.loading = true; s.error = null; });
    b.addCase(registerUser.fulfilled, (s, a) => { s.user = a.payload; s.loading = false; });
    b.addCase(registerUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;