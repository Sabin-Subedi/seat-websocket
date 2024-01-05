/* eslint-disable @typescript-eslint/no-explicit-any */
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

function useSocket() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }
    function onConnectionError(error: any) {
      notifications.show({
        title: "Connection error",
        message: error?.message,
        color: "red",
      });
    }
    socket.on("connection-error", onConnectionError);

    socket.on("connection-success", (data) => {
      notifications.show({
        title: "Connection success",
        message: data?.message,
        color: "green",
      });
    });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.offAny();
    };
  }, []);
  return { isConnected };
}

export default useSocket;
