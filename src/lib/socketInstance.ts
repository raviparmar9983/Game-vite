import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { environment } from "./env";
import toast from "react-hot-toast";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    const token = Cookies.get("accessToken");

    socket = io(environment.SOCKET_URL, {
      auth: {
        token, // 🔐 send jwt token
      },
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      // console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      // console.log("Socket disconnected");
    });

    socket.on("connect_error", (err: any) => {
      if (err?.message === "Invalid Token!!") {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        window.location.href = "/auth/login";
      }

      toast.error(err.message || "Socket connection error");
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};  