import React, { useState, useEffect, useRef } from "react";
import "@styles/monitoredusercard.css"; // Import the CSS file for styling
import { fetchUserLogs } from "@service/adminService"; // Import the service function

interface MonitoredUserCardProps {
  monitoredUserId: number; // Add the unique ID for the user
  username: string;
  reason: string;
  flaggedAt: string;
}

interface LogEntry {
  logEntryId: number; // Primary key
  action: string; // Action performed (CREATE, READ, UPDATE, DELETE)
  entity: string; // Entity type (Song, Artist, User)
  timestamp: string; // When the action occurred
}

const MonitoredUserCard: React.FC<MonitoredUserCardProps> = ({ monitoredUserId, username, reason, flaggedAt }) => {
  const [logs, setLogs] = useState<LogEntry[] | null>(null); // State to store logs
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // State to toggle overlay
  const [error, setError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null); // Ref for the overlay

  const handleFetchLogs = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      if (!token) {
        setError("No authentication token found.");
        return;
      }

      const userLogs = await fetchUserLogs(monitoredUserId, token); // Fetch logs from the service
      setLogs(userLogs);
      setIsOverlayVisible(true); // Show the overlay
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs.");
    }
  };

  const handleCloseOverlay = () => {
    setIsOverlayVisible(false);
    setLogs(null);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
      handleCloseOverlay();
    }
  };

  useEffect(() => {
    if (isOverlayVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOverlayVisible]);

  return (
    <div className="monitored-user-card">
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Reason:</strong> {reason}</p>
      <p><strong>Flagged At:</strong> {new Date(flaggedAt).toLocaleString()}</p>
      <button className="fetch-logs-button" onClick={handleFetchLogs}>
        View Logs
      </button>

      {isOverlayVisible && (
        <div className="logs-overlay">
          <div className="logs-content" ref={overlayRef}>
            <h3>Logs for {username}</h3>
            {logs ? (
              <ul>
                {logs.map((log) => (
                  <li key={log.logEntryId}>
                    <p><strong>Action:</strong> {log.action.toString()}</p> {/* Convert enum to string */}
                    <p><strong>Entity:</strong> {log.entity}</p>
                    <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading logs...</p>
            )}
            <button className="close-overlay-button" onClick={handleCloseOverlay}>
              Close
            </button>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default MonitoredUserCard;