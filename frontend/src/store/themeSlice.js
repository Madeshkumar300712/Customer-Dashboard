import { createSlice } from "@reduxjs/toolkit";

const saved = localStorage.getItem("hx_theme") || "dark";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: saved,           // "dark" | "light"
    sidebarCollapsed: false,
  },
  reducers: {
    toggleTheme: (s) => {
      s.mode = s.mode === "dark" ? "light" : "dark";
      localStorage.setItem("hx_theme", s.mode);
    },
    setTheme: (s, a) => {
      s.mode = a.payload;
      localStorage.setItem("hx_theme", a.payload);
    },
    toggleSidebar: (s) => {
      s.sidebarCollapsed = !s.sidebarCollapsed;
    },
  },
});

export const { toggleTheme, setTheme, toggleSidebar } = themeSlice.actions;
export default themeSlice.reducer;