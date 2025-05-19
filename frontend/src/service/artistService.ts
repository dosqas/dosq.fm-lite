import { Artist } from "@entities/artist";
import { SERVER_IP } from "@config/config";
import { addToOfflineQueue } from "@utils/offline/offlineUtils";

// WebSocket connection for artists
export const connectArtistWebSocket = (
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
      const token = localStorage.getItem("token");
      ws = new WebSocket(`ws://${SERVER_IP}/ws/artists?token=${token}`);

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

  connect();

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

// Fetch paginated artists
export const fetchArtistsLimited = async (
  page: number,
  itemsPerPage: number,
  containsString?: string | undefined
): Promise<{ artists: Artist[]; hasMore: boolean }> => {
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", itemsPerPage.toString());
  if (containsString) {
    queryParams.append("containsString", containsString);
  }

  const token = localStorage.getItem("token");

  const response = await fetch(`https://${SERVER_IP}/api/artists/limited?${queryParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch artists");
  }

  const result = await response.json();
  return { artists: result.paginatedArtists, hasMore: result.hasMore };
};

// Add an artist online
export const addArtistOnline = async (formattedArtist: Artist): Promise<Artist> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`https://${SERVER_IP}/api/artists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formattedArtist),
  });

  if (!response.ok) {
    throw new Error("Failed to add artist");
  }

  return await response.json();
};

// Update an artist online
export const updateArtistOnline = async (
  id: number | string,
  formattedArtist: Partial<Artist>
): Promise<Artist> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`https://${SERVER_IP}/api/artists/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formattedArtist),
  });

  if (!response.ok) {
    throw new Error("Failed to update artist");
  }

  return await response.json();
};

// Delete an artist online
export const deleteArtistOnline = async (id: string | number): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`https://${SERVER_IP}/api/artists/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete artist");
  }
};

// Add an artist to the offline queue
export const addArtistOffline = (formattedArtist: Artist) => {
  const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  addToOfflineQueue({
    method: "POST",
    url: `/api/artists`,
    body: { ...formattedArtist, tempId },
  });

  return { ...formattedArtist, artistId: tempId };
};

// Update an artist in the offline queue
export const updateArtistOffline = (id: number | string, formattedArtist: Partial<Artist>) => {
  addToOfflineQueue({
    method: "PATCH",
    url: `/api/artists/${id}`,
    body: formattedArtist,
  });

  return { ...formattedArtist, artistId: id };
};

// Delete an artist from the offline queue
export const deleteArtistOffline = (id: string | number) => {
  addToOfflineQueue({
    method: "DELETE",
    url: `/api/artists/${id}`,
    body: null,
  });

  return id;
};