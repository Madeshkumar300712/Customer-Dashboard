import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const fetchNotifications = createAsyncThunk(
  "notif/fetch",
  async () => {
    const res = await api.getNotifications();
    return res.data;
  }
);

export const markAllReadThunk = createAsyncThunk(
  "notif/markRead",
  async () => {
    await api.markAllRead();
    return true;
  }
);

const notifSlice = createSlice({
  name: "notifications",

  initialState: {
    items: [],
    unread: 0,
  },

  reducers: {
    pushNotification: (state, action) => {
      const item = {
        ...action.payload,
        _id: Date.now().toString(),
        read: false,
        createdAt: new Date().toISOString(),
      };

      state.items.unshift(item);
      state.unread += 1;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const data = Array.isArray(action.payload) ? action.payload : [];

      state.items = data;
      state.unread = data.filter((n) => !n.read).length;
    });

    builder.addCase(markAllReadThunk.fulfilled, (state) => {
      state.items = state.items.map((n) => ({ ...n, read: true }));
      state.unread = 0;
    });
  },
});

export const { pushNotification } = notifSlice.actions;
export default notifSlice.reducer;