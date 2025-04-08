import { getOfflineQueue, saveOfflineQueue, clearOfflineQueue } from "../data/offlineQueue";

export const syncOfflineQueue = async () => {
  const queue = getOfflineQueue();
  const idMap = new Map(); // To track tempId to serverId mappings

  for (let i = 0; i < queue.length; i++) {
    const request = queue[i];
    
    try {
      // Replace temp IDs in URLs and bodies
      if (request.body?.tempId && idMap.has(request.body.tempId)) {
        request.body.id = idMap.get(request.body.tempId);
        delete request.body.tempId;
      }

      const url = request.url.replace(/temp_[^/]+/g, (match) => 
        idMap.get(match) || match
      );

      const response = await fetch(url, {
        method: request.method,
        headers: { "Content-Type": "application/json" },
        body: request.body ? JSON.stringify(request.body) : null,
      });

      if (!response.ok) throw new Error(`Failed: ${response.status}`);

      // For POST requests, store the mapping
      if (request.method === "POST" && request.body?.tempId) {
        const responseData = await response.json();
        idMap.set(request.body.tempId, responseData.id);
      }
    } catch (error) {
      console.error("Sync error:", error);
    }
  }

  clearOfflineQueue();
};