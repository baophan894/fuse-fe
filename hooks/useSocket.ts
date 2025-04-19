// hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'https://api-dev.fuses.fun/'; // hoặc URL backend

export const useSocket = (userId: string) => {
  const socketRef = useRef<Socket>();

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(SOCKET_SERVER_URL, {
      query: { userId },
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to WebSocket');
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  return socketRef.current;
};
