import React, { useEffect, useState } from "react";
import { fetchMonitoredUsers, MonitoredUser } from "@service/adminService";
import MonitoredUserCard from "@cards/MonitoredUserCard";

const MonitoredUsersList: React.FC = () => {
  const [monitoredUsers, setMonitoredUsers] = useState<MonitoredUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMonitoredUsers = async () => {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      try {
        const users = await fetchMonitoredUsers(token); // Use the service method
        setMonitoredUsers(users);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching monitored users.");
      }
    };

    loadMonitoredUsers();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="monitored-users-list" style={{ minHeight: "60vh"}}>
      <ul>
        {monitoredUsers.map((user) => (
          <li key={user.monitoredUserId}>
            <MonitoredUserCard
              monitoredUserId={user.monitoredUserId}
              username={user.username}
              reason={user.reason}
              flaggedAt={user.flaggedAt}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonitoredUsersList;