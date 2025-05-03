"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

interface ConnectionStatusContextProps {
  isOnline: boolean;
  isServerReachable: boolean;
  statusMessage: string;
}

const ConnectionStatusContext = createContext<ConnectionStatusContextProps>({
  isOnline: true,
  isServerReachable: true,
  statusMessage: "",
});

export const ConnectionStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isServerReachable, setIsServerReachable] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP;

  const checkServerStatus = async () => {
    if (checkServerStatus.isRunning) {
      return;
    }
  
    checkServerStatus.isRunning = true;
  
    try {
      const response = await fetch(`http://${SERVER_IP}/api/Health`);
      if (response.ok) {
        setIsServerReachable(true);
      } else {
        setIsServerReachable(false);
      }
    } catch (error) {
      setIsServerReachable(false);
    }
  
    checkServerStatus.isRunning = false;
  };
  
  checkServerStatus.isRunning = false;
  

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    const interval = setInterval(() => {
      if (navigator.onLine) {
        checkServerStatus(); 
      } else {
        setIsServerReachable(false); 
      }
    }, 1000); 

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setStatusMessage("You are offline. Check your network connection.");
    } else if (!isServerReachable) {
      setStatusMessage("Server is unreachable. Retrying...");
    } else {
      setStatusMessage("Connection restored!"); 
    }
  }, [isOnline, isServerReachable]);

  return (
    <ConnectionStatusContext.Provider value={{ isOnline, isServerReachable, statusMessage }}>
      {children}
    </ConnectionStatusContext.Provider>
  );
};

export const useConnectionStatus = () => useContext(ConnectionStatusContext);