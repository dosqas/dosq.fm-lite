import { Song } from "@entities/song";
import { SERVER_IP } from "@config/config";
import { addToOfflineQueue } from "@utils/offline/offlineUtils";

export const connectWebSocket = (
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
      ws = new WebSocket(`ws://${SERVER_IP}/ws/songs`);

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
    queryParams.append("rangetype", "month");
  } else {
    queryParams.append(
      "from",
      `${selectedYear}-${selectedMonth.padStart(2, "0")}-${selectedDay.padStart(2, "0")}`
    );
    queryParams.append("rangetype", "day");
  }

  const token = localStorage.getItem("token"); // Example: Retrieve token from localStorage

  const response = await fetch(`http://${SERVER_IP}/api/songs/limited?${queryParams.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`, // Include the Bearer token
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }

  const result = await response.json();
  return { songs: result.songs, hasMore: result.hasMore };
};

// Function to handle adding a song to the backend
export const addSongOnline = async (formattedSong: Song): Promise<Song> => {
  const response = await fetch(`http://${SERVER_IP}/api/songs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedSong),
  });

  if (!response.ok) {
    throw new Error("Failed to add song");
  }

  // Return the newly created song from the backend
  return await response.json();
};

export const updateSongOnline = async (
  id: number | string,
  formattedSong: Partial<Song>
): Promise<Song> => {
  const response = await fetch(`http://${SERVER_IP}/api/songs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedSong),
  });

  if (!response.ok) {
    throw new Error("Failed to update song");
  }

  // Return the updated song from the backend
  return await response.json();
};

export const deleteSongOnline = async (id: string | number): Promise<void> => {
  const response = await fetch(`http://${SERVER_IP}/api/songs/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete song");
  }
};

// Function to handle adding a song to the offline queue
export const addSongOffline = (formattedSong: Song, selectedYear?: string | null, selectedMonth?: string | null, selectedDay?: string | null) => {
  const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Add the song to the offline queue
  addToOfflineQueue({
    method: "POST",
    url: `/api/songs`, // No need for SERVER_IP here; it will sync later
    body: { ...formattedSong, tempId }, // Include both tempId and id
  });

  // Return the song with the temporary ID for immediate frontend updates
  return { ...formattedSong, song_id: tempId };
};

export const updateSongOffline = (
  id: number | string,
  formattedSong: Partial<Song>
) => {
  addToOfflineQueue({
    method: "PATCH",
    url: `/api/songs/${id}`, // No need for SERVER_IP here; it will sync later
    body: formattedSong,
  });

  // Return the updated song for immediate frontend updates
  return { ...formattedSong, song_id: id };
};

export const deleteSongOffline = (id: string | number) => {
  addToOfflineQueue({
    method: "DELETE",
    url: `/api/songs/${id}`, // No need for SERVER_IP here; it will sync later
    body: null,
  });

  // Return the ID of the song to be deleted for immediate frontend updates
  return id;
};