import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

export const fetchOrders = createAsyncThunk("orders/fetch", async () => {
  const res = await api.getOrders();
  return res.data;
});
export const addOrder = createAsyncThunk("orders/add", async (data) => {
  const res = await api.createOrder(data);
  return res.data;
});
export const editOrder = createAsyncThunk("orders/edit", async ({ id, data }) => {
  const res = await api.updateOrder(id, data);
  return res.data;
});
export const removeOrder = createAsyncThunk("orders/remove", async (id) => {
  await api.deleteOrder(id);
  return id;
});

const orderSlice = createSlice({
  name: "orders",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchOrders.pending, (s) => { s.loading = true; });
    b.addCase(fetchOrders.fulfilled, (s, a) => { s.items = a.payload; s.loading = false; });
    b.addCase(addOrder.fulfilled, (s, a) => { s.items.unshift(a.payload); });
    b.addCase(editOrder.fulfilled, (s, a) => {
      const i = s.items.findIndex(o => o._id === a.payload._id);
      if (i !== -1) s.items[i] = a.payload;
    });
    b.addCase(removeOrder.fulfilled, (s, a) => {
      s.items = s.items.filter(o => o._id !== a.payload);
    });
  },
});

export default orderSlice.reducer;