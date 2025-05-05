export const addToOfflineQueue = (operation: { method: string; url: string; body?: any }) => {
    const queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
    queue.push(operation);
    localStorage.setItem("offlineQueue", JSON.stringify(queue));
  };
  
  export const getOfflineQueue = () => {
    return JSON.parse(localStorage.getItem("offlineQueue") || "[]");
  };
  
  export const clearOfflineQueue = () => {
    localStorage.removeItem("offlineQueue");
  };