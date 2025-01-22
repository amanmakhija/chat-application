import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_SERVER_BASE_URL
    : import.meta.env.VITE_SERVER_BASE_URL_DEV;

export const socket = io(URL, { autoConnect: false });
