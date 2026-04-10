import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { clearBackendSession, getBackendAccessToken } from "./authSession";
import { environment } from "./env";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(environment.SOCKET_URL, {
      auth: (callback) => {
        callback({
          token: getBackendAccessToken(),
        });
      },
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect_error", (err: { message?: string }) => {
      if (err?.message === "Invalid Token!!") {
        clearBackendSession();
      }

      toast.error(err?.message || "Socket connection error");
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
