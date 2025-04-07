import { getOfflineQueue, saveOfflineQueue, clearOfflineQueue } from "../data/offlineQueue";

export const syncOfflineQueue = async () => {
  const queue = getOfflineQueue();

  if (queue.length === 0) {
    console.log("No offline requests to sync.");
    return;
  }

  console.log("Syncing offline requests:", queue);

  for (const request of queue) {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: { "Content-Type": "application/json" },
        body: request.body ? JSON.stringify(request.body) : null,
      });

      if (!response.ok) {
        throw new Error(`Failed to process request: ${response.status}`);
      }

      console.log("Request synced successfully:", request);
    } catch (error) {
      console.error("Failed to sync request:", request, error);
      return; // Stop syncing if a request fails
    }
  }

  // Clear the queue after successful sync
  clearOfflineQueue();
};