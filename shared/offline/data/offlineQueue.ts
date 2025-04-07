interface OfflineRequest {
    method: string;
    url: string;
    body: any;
  }
  
  const OFFLINE_QUEUE_KEY = "offlineQueue";
  
  // Get the offline queue from local storage
  export const getOfflineQueue = (): OfflineRequest[] => {
    return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || "[]");
  };
  
  // Save the offline queue to local storage
  export const saveOfflineQueue = (queue: OfflineRequest[]) => {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  };
  
  // Add a request to the offline queue
  export const addToOfflineQueue = (request: OfflineRequest) => {
    const queue = getOfflineQueue();
    queue.push(request);
    saveOfflineQueue(queue);
    console.log("Request added to offline queue:", request);
  };
  
  // Clear the offline queue
  export const clearOfflineQueue = () => {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    console.log("Offline queue cleared.");
  };