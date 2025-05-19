import { SERVER_IP } from "@config/config";

export interface MonitoredUser {
  monitoredUserId: number;
  username: string;
  reason: string;
  flaggedAt: string;
}

export interface LogEntry {
  logEntryId: number; // Primary key
  action: string; // Action performed (CREATE, READ, UPDATE, DELETE)
  entity: string; // Entity type (Song, Artist, User)
  timestamp: string; // When the action occurred
}

export const fetchMonitoredUsers = async (token: string): Promise<MonitoredUser[]> => {
  try {
    const response = await fetch(`https://${SERVER_IP}/api/admin/monitored-users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch monitored users.");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching monitored users:", err);
    throw err; // Re-throw the error to handle it in the calling component
  }
};

export const fetchUserLogs = async (userId: number, token: string): Promise<LogEntry[]> => {
  try {
    const response = await fetch(`https://${SERVER_IP}/api/admin/user-logs/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to fetch user logs.");
    }

    return await response.json();
  } catch (err) {
    console.error("Error fetching user logs:", err);
    throw err; // Re-throw the error to handle it in the calling component
  }
};