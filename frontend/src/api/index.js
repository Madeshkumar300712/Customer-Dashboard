import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("hx_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem("hx_token");
    localStorage.removeItem("hx_user");
    window.location.href = "/login";
  }
  return Promise.reject(err);
});

// Auth
export const login    = (d) => api.post("/auth/login", d);
export const register = (d) => api.post("/auth/register", d);
export const getMe    = ()  => api.get("/auth/me");

// Orders
export const getOrders    = ()       => api.get("/orders");
export const createOrder  = (d)      => api.post("/orders", d);
export const updateOrder  = (id, d)  => api.put(`/orders/${id}`, d);
export const deleteOrder  = (id)     => api.delete(`/orders/${id}`);
export const exportCSV    = ()       => api.get("/orders/export/csv", { responseType: "blob" });
export const bulkUpdate   = (d)      => api.post("/orders/bulk/update", d);
export const bulkDelete   = (d)      => api.post("/orders/bulk/delete", d);

// Dashboards
export const getDashboards    = ()       => api.get("/dashboard");
export const getTemplates     = ()       => api.get("/dashboard/templates");
export const getDashboard     = (id)     => api.get(`/dashboard/${id}`);
export const createDashboard  = (d)      => api.post("/dashboard", d);
export const saveDashboard    = (id, d)  => api.put(`/dashboard/${id}`, d);
export const deleteDashboard  = (id)     => api.delete(`/dashboard/${id}`);
export const duplicateDashboard = id        => api.post(`/dashboard/${id}/duplicate`);
export const renameDashboard    = (id, name) => api.patch(`/dashboard/${id}/rename`, { name });

// Notifications
export const getNotifications = () => api.get("/notifications");
export const markAllRead      = () => api.patch("/notifications/read-all");
export const deleteNotif      = (id) => api.delete(`/notifications/${id}`);
