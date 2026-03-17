import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const fetchDashboards = createAsyncThunk(
  "dashboard/fetchAll",
  async () => {
    const res = await api.getDashboards();
    return res.data;
  }
);

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchOne",
  async (id) => {
    const res = await api.getDashboard(id);
    return res.data;
  }
);

export const createDashboardThunk = createAsyncThunk(
  "dashboard/create",
  async (data) => {
    const res = await api.createDashboard(data);
    return res.data;
  }
);

export const saveDashboardThunk = createAsyncThunk(
  "dashboard/save",
  async ({ id, data }) => {
    const res = await api.saveDashboard(id, data);
    return res.data;
  }
);

export const deleteDashboardThunk = createAsyncThunk(
  "dashboard/delete",
  async (id) => {
    await api.deleteDashboard(id);
    return id;
  }
);

export const fetchTemplates = createAsyncThunk(
  "dashboard/templates",
  async () => {
    const res = await api.getTemplates();
    return res.data;
  }
);

export const duplicateDashboardThunk = createAsyncThunk(
  "dashboard/duplicate",
  async (id) => {
    const res = await api.duplicateDashboard(id);
    return res.data;
  }
);

export const renameDashboardThunk = createAsyncThunk(
  "dashboard/rename",
  async ({ id, name }) => {
    const res = await api.renameDashboard(id, name);
    return res.data;
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    list: [],
    current: null,
    templates: [],
    widgets: [],
    dateFilter: "All time",
    loading: false,
  },

  reducers: {
    setWidgets: (s, a) => {
      s.widgets = a.payload;
    },
    setDateFilter: (s, a) => {
      s.dateFilter = a.payload;
    },
    setCurrent: (s, a) => {
      s.current = a.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchDashboards.fulfilled, (s, a) => {
        s.list = a.payload;
      })

      .addCase(fetchDashboard.fulfilled, (s, a) => {
        s.widgets = a.payload.widgets || [];
        s.dateFilter = a.payload.dateFilter || "All time";
        s.current = a.payload;
      })

      .addCase(createDashboardThunk.fulfilled, (s, a) => {
        s.list.unshift(a.payload);
      })

      .addCase(saveDashboardThunk.fulfilled, (s, a) => {
        const i = s.list.findIndex((d) => d._id === a.payload._id);
        if (i !== -1) s.list[i] = a.payload;
        s.widgets = a.payload.widgets;
      })

      .addCase(deleteDashboardThunk.fulfilled, (s, a) => {
        s.list = s.list.filter((d) => d._id !== a.payload);
      })

      .addCase(fetchTemplates.fulfilled, (s, a) => {
        s.templates = a.payload;
      })

      .addCase(duplicateDashboardThunk.fulfilled, (s, a) => {
        s.list.unshift(a.payload);
      })

      .addCase(renameDashboardThunk.fulfilled, (s, a) => {
        const i = s.list.findIndex((d) => d._id === a.payload._id);
        if (i !== -1) s.list[i] = a.payload;
      });
  },
});

export const { setWidgets, setDateFilter, setCurrent } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;