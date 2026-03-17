import { configureStore } from "@reduxjs/toolkit";
import orderReducer       from "./orderSlice";
import dashboardReducer   from "./dashboardSlice";
import authReducer        from "./authSlice";
import notifReducer       from "./notificationSlice";
import themeReducer       from "./themeSlice";

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    dashboard: dashboardReducer,
    auth: authReducer,
    notifications: notifReducer,
    theme: themeReducer,
  },
});