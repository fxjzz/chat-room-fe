import { wsHOST } from "@/http/config";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const HEARTBEAT_TIMEOUT = 10 * 1000;
const HEARTBEAT_INTERVAL = 30 * 1000;
let lastPing: number;

function useWebSocket(userName: string) {
  const socket = io(wsHOST, {
    autoConnect: false,
  });
  let timer = useRef<NodeJS.Timer>();
  useEffect(() => {
    socket.on("connect", () => {
      console.log("连接成功");
      lastPing = Date.now();
      socket.emit("connection", userName);
      timer.current = setInterval(() => {
        const now = Date.now();
        if (now - lastPing > HEARTBEAT_TIMEOUT) {
          console.log("超时,关闭连接");
          socket.disconnect();
          return;
        }
        socket.emit("ping");
      }, HEARTBEAT_INTERVAL);
    });

    socket.on("pong", () => {
      lastPing = Date.now();
    });

    return () => {
      clearInterval(timer.current);
      socket.disconnect();
    };
  }, [socket, userName]);
  return [socket];
}

export default useWebSocket;
