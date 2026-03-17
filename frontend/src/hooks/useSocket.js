import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { pushNotification } from "../store/notificationSlice";

let socket = null;

export function useSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("✅ Socket connected:", socket.id);
      });

      socket.on("notification", (data) => {
        dispatch(pushNotification(data));
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });
    }

    return () => {
      socket?.connect();
      socket = null;
    };
  }, [dispatch]);
}