import { Song } from "@entities/song";
import { SERVER_IP } from "@src/config";

export const connectWebSocket = (
    SERVER_IP: string,
    onMessage: (message: any) => void,
    onConnectionStatusChange: (status: string) => void
  ): (() => void) => {
    let ws: WebSocket | null = null;
    let retryCount = 0;
    const maxRetries = 5;
    const baseDelay = 1000;
    let retryTimeout: NodeJS.Timeout | null = null;
  
    const connect = () => {
      onConnectionStatusChange(retryCount > 0 ? "retrying..." : "connecting");
  
      try {
        ws = new WebSocket(`ws://${SERVER_IP}`);
  
        ws.onopen = () => {
          console.log("WebSocket connected successfully");
          onConnectionStatusChange("connected");
          retryCount = 0;
        };
  
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            onMessage(message);
          } catch (error) {
            console.error("Failed to process WebSocket message:", error);
          }
        };
  
        ws.onclose = (event) => {
          console.log("WebSocket closed:", {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
          });
  
          if (!event.wasClean) {
            scheduleReconnect();
          }
        };
      } catch (error) {
        console.error("WebSocket initialization crashed:", error);
        scheduleReconnect();
      }
    };
  
    const scheduleReconnect = () => {
      if (retryCount < maxRetries) {
        const delay = Math.min(baseDelay * Math.pow(2, retryCount), 30000);
        retryCount++;
  
        console.groupCollapsed(`WebSocket retry #${retryCount}`);
        console.log("Next attempt in:", `${delay}ms`);
        console.log("Current retry count:", retryCount);
        console.groupEnd();
  
        retryTimeout = setTimeout(connect, delay);
      } else {
        onConnectionStatusChange("failed");
      }
    };
  
    // Start the initial connection
    connect();
  
    // Return a cleanup function
    return () => {
      if (ws) {
        ws.onopen = null;
        ws.onclose = null;
        ws.onmessage = null;
  
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, "Component unmounting");
        }
      }
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  };

export const toggleAutoGeneration = async (isAutoGenerating: boolean): Promise<void> => {
    const endpoint = isAutoGenerating
      ? `http://${SERVER_IP}/api/songs/stop-auto-generation`
      : `http://${SERVER_IP}/api/songs/start-auto-generation`;
  
    const response = await fetch(endpoint, {
      method: "POST",
    });
  
    if (!response.ok) {
      throw new Error(
        isAutoGenerating
          ? "Failed to stop auto-generation"
          : "Failed to start auto-generation"
      );
    }
  
    console.log(
      isAutoGenerating
        ? "Auto-generation stopped"
        : "Auto-generation started"
    );
  };

export const fetchSongsLimited = async (
  page: number,
  itemsPerPage: number,
  selectedYear?: string | null,
  selectedMonth?: string | null,
  selectedDay?: string | null
): Promise<{ songs: Song[]; hasMore: boolean }> => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", itemsPerPage.toString());

  if (!selectedYear) {
    queryParams.append("from", "1900-01-01");
    queryParams.append("rangetype", "all");
  } else if (!selectedMonth) {
    queryParams.append("from", `${selectedYear}-01-01`);
    queryParams.append("rangetype", "year");
  } else if (!selectedDay) {
    queryParams.append("from", `${selectedYear}-${selectedMonth}-01`);
    queryParams.append("rangetype", "1month");
  } else {
    queryParams.append(
      "from",
      `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`
    );
    queryParams.append("rangetype", "1day");
  }

  const response = await fetch(`http://${SERVER_IP}/api/songs/limited?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }

  const result = await response.json();
  return { songs: result.songs, hasMore: result.hasMore };
};
