import { io, Socket } from "socket.io-client";

// This variable will hold our socket instance (singleton)
let socket: Socket | null = null;

// Function to initiate the socket connection
export const initiateSocketConnection = (): Socket => {
  if (!socket) {
    // Use an environment variable for the Socket.IO URL or fallback to localhost
    socket = io(process.env.NEXT_PUBLIC_BASE_URL, {
      transports: ["websocket"], // You can configure additional options as needed
    });
    console.log("Socket connected:", socket.id);
  }
  return socket;
};

// Function to disconnect the socket (if needed)
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
};

export default socket;
