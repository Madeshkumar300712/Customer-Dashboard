import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";

const BACKEND = (import.meta.env.VITE_API_URL || "").replace("/api", "");
if (BACKEND) {
  const ping = () => fetch(BACKEND).catch(() => {});
  ping(); // ping immediately on load
  setInterval(ping, 14 * 60 * 1000); // then every 14 minutes
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);