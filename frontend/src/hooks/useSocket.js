import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { pushNotification } from "../store/notificationSlice";

let socket;

export function useSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Use the backend URL from env variable, strip /api from the end
    const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api")
      .replace("/api", "");

    socket = io(backendUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3,
    });

    socket.on("notification", (data) => {
      dispatch(pushNotification(data));
    });

    socket.on("connect_error", () => {
      // Silent fail — notifications won't work but app still functions
      console.log("Socket connection failed - continuing without real-time");
    });

    return () => {
      socket?.disconnect();
    };
  }, []);
}
