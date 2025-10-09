"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  lastPayment: any | null;
  lastSession: any | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  lastPayment: null,
  lastSession: null,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPayment, setLastPayment] = useState<any | null>(null);
  const [lastSession, setLastSession] = useState<any | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
    });

    // Socket event handlers
    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Subscribe to relevant channels
      socketInstance.emit('subscribe:transactions');
      socketInstance.emit('subscribe:sessions');
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('payment:update', (payment) => {
      console.log('Payment update received:', payment);
      setLastPayment(payment);
    });

    socketInstance.on('session:update', (session) => {
      console.log('Session update received:', session);
      setLastSession(session);
    });

    socketInstance.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, lastPayment, lastSession }}>
      {children}
    </WebSocketContext.Provider>
  );
};