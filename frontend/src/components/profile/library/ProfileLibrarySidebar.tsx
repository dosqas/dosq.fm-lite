import React, { useMemo, useRef, useEffect, useState } from "react";
import { Song } from "@shared/types/song";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../../../styles/profile/library/profile-library-sidebar.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface LibrarySidebarProps {
  onYearSelect: (year: string | null) => void;
  onMonthSelect: (month: string | null) => void;
  onDaySelect: (day: string | null) => void;
  selectedYear: string | null;
  selectedMonth: string | null;
  selectedDay: string | null;
}

const LibrarySidebar: React.FC<LibrarySidebarProps> = ({
  onYearSelect,
  onMonthSelect,
  onDaySelect,
  selectedYear,
  selectedMonth,
  selectedDay,
}) => {
  const [groupedData, setGroupedData] = useState<{ [key: string]: number }>({});
  const chartRef = useRef<any>(null);

  const SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP;

  useEffect(() => {
    const fetchGroupedData = async () => {
      try {
        const queryParams = new URLSearchParams();
  
        if (!selectedYear) {
          queryParams.append("from", "1900-01-01");
          queryParams.append("rangetype", "all");
        } else if (!selectedMonth) {
          queryParams.append("from", `${selectedYear}-01-01`);
          queryParams.append("rangetype", "year");
        } else {
          queryParams.append("from", `${selectedYear}-${selectedMonth}-01`);
          queryParams.append("rangetype", "1month");
        }
  
        const response = await fetch(`http://${SERVER_IP}/api/songs?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch filtered songs");
        }
  
        const data: Song[] = await response.json();
  
        const grouped = data.reduce((acc: { [key: string]: number }, song: Song) => {
          let key = "";
          if (!selectedYear) {
            key = song.year;
          } else if (!selectedMonth) {
            key = song.month.padStart(2, "0");
          } else {
            key = song.day.padStart(2, "0");
          }
  
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
  
        setGroupedData(grouped);
      } catch (error) {
        console.error("Error fetching grouped data:", error);
      }
    };
  
    fetchGroupedData(); // Fetch data once when the component mounts or filters change
  }, [selectedYear, selectedMonth, selectedDay]);
  
  useEffect(() => {
    let ws: WebSocket | null = null;
    let retryCount = 0;
    const maxRetries = 5;
    const baseDelay = 1000; // Start with 1 second delay
    let retryTimeout: NodeJS.Timeout | null = null;
  
    const connectWebSocket = () => {
      try {
        ws = new WebSocket(`ws://${SERVER_IP}`);
  
        ws.onopen = () => {
          console.log("Connected to WebSocket server");
          retryCount = 0; // Reset retry counter on success
          if (retryTimeout) {
            clearTimeout(retryTimeout);
          }
        };
  
        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
  
            if (message.type === "SONG_LIST") {
              const grouped = message.payload.reduce((acc: { [key: string]: number }, song: Song) => {
                let key = "";
                if (!selectedYear) {
                  key = song.year;
                } else if (!selectedMonth) {
                  key = song.month.padStart(2, "0");
                } else {
                  key = song.day.padStart(2, "0");
                }
                acc[key] = (acc[key] || 0) + 1;
                return acc;
              }, {});
              setGroupedData(grouped);
            } 
            else if (message.type === "NEW_SONG") {
              const newSong: Song = message.payload;
              setGroupedData((prevGroupedData) => {
                const updatedGroupedData = { ...prevGroupedData };
                let key = "";
  
                if (!selectedYear) {
                  key = newSong.year;
                } else if (!selectedMonth) {
                  key = newSong.month.padStart(2, "0");
                } else {
                  key = newSong.day.padStart(2, "0");
                }
  
                updatedGroupedData[key] = (updatedGroupedData[key] || 0) + 1;
                return updatedGroupedData;
              });
            }
          } catch (parseError) {
            console.error("Failed to parse WebSocket message:", parseError);
          }
        };
  
        ws.onclose = (event) => {
          console.log(`Disconnected (code: ${event.code}, reason: ${event.reason})`);
          if (!event.wasClean && retryCount < maxRetries) {
            const delay = Math.min(baseDelay * Math.pow(2, retryCount), 30000); // Exponential backoff with max 30s
            retryCount++;
            console.log(`Retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`);
            retryTimeout = setTimeout(connectWebSocket, delay);
          }
        };
  
        ws.onerror = (error) => {
          console.error("WebSocket error event:", {
            error,
            readyState: ws?.readyState,
            url: ws?.url
          });
          // The close handler will trigger reconnect
        };
  
      } catch (error) {
        console.error("WebSocket initialization error:", error);
        if (retryCount < maxRetries) {
          const delay = Math.min(baseDelay * Math.pow(2, retryCount), 30000);
          retryCount++;
          retryTimeout = setTimeout(connectWebSocket, delay);
        }
      }
    };
  
    // Initial connection
    connectWebSocket();
  
    return () => {
      if (ws) {
        // Clean up all event handlers
        ws.onopen = null;
        ws.onmessage = null;
        ws.onclose = null;
        ws.onerror = null;
        
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, "Component unmounting");
        }
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [selectedYear, selectedMonth, selectedDay, SERVER_IP]);


  const allMonths = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  }, []);

  const allDaysInMonth = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];
    const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, "0"));
  }, [selectedYear, selectedMonth]);

  const chartData = useMemo(() => {
    let completeData: { [key: string]: number };

    if (!selectedYear) {
      completeData = groupedData;
    } else if (!selectedMonth) {
      completeData = allMonths.reduce((acc, month) => {
        acc[month] = groupedData[month] || 0;
        return acc;
      }, {} as { [key: string]: number });
    } else {
      completeData = allDaysInMonth.reduce((acc, day) => {
        acc[day] = groupedData[day] || 0;
        return acc;
      }, {} as { [key: string]: number });
    }

    const sortedEntries = Object.entries(completeData).sort(([a], [b]) => parseInt(a) - parseInt(b));
    const labels = sortedEntries.map(([key]) => {
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      if (!selectedYear) {
        return key;
      } else if (!selectedMonth) {
        const monthIndex = parseInt(key, 10) - 1;
        return `${monthNames[monthIndex]} ${selectedYear}`;
      } else {
        return `${parseInt(key, 10)} ${monthNames[parseInt(selectedMonth, 10) - 1]}`;
      }
    });
    const data = sortedEntries.map(([, value]) => value);

    return {
      labels,
      datasets: [
        {
          label: "Number of Songs",
          data,
          backgroundColor: "#b9312a",
          hoverBackgroundColor: "#b54f49",
          borderColor: "#b9312a",
          borderWidth: 1,
        },
      ],
    };
  }, [groupedData, allMonths, allDaysInMonth, selectedYear, selectedMonth]);

  const chartHeight = useMemo(() => {
    const numItems = selectedYear && !selectedMonth ? allMonths.length : allDaysInMonth.length;
    const minHeight = 250;
    const heightPerItem = 17.5;
    return Math.max(minHeight, numItems * heightPerItem);
  }, [allMonths, allDaysInMonth, selectedYear, selectedMonth]);

  const chartOptions = useMemo(() => {
    return {
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      hover: {
        mode: "nearest" as const,
        intersect: true,
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false, 
          },
          ticks: {
            stepSize: 1,
            callback: (value: number | string) => `${value}`,
            color: "#ABA8A7",
            rotation: 0,
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            display: false, 
          },
          ticks: {
            color: "#ABA8A7",
            stepSize: 1,
            font: {
              size: 10,
            }
          },
        },
      },
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        },
      },
    };
  }, [selectedYear, selectedMonth]);

  const handleBarClick = (event: any) => {
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const elements = chart.getElementsAtEventForMode(
      event,
      "nearest",
      { intersect: true },
      false
    );

    if (elements.length > 0) {
      const index = elements[0].index;
      const label = chartData.labels[index];

      if (!selectedYear) {
        onYearSelect(label);
      } else if (!selectedMonth) {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        const [monthName] = label.split(" ");
        const monthIndex = monthNames.indexOf(monthName) + 1;
        const numericMonth = monthIndex.toString().padStart(2, "0");
        onMonthSelect(numericMonth);
      } else {
        const day = label.split(" ")[0]; 
        const numericDay = day.padStart(2, "0"); 
        onDaySelect(numericDay);
      }
    }
  };

  const handleBackClick = () => {
    onDaySelect(null);
    if (selectedMonth) {
      onMonthSelect(null);
    } else if (selectedYear) {
      onYearSelect(null);
    }
  };

  return (
    <div className="library-sidebar">
      <h3>Date range</h3>
      <div className="chart-container" style={{ height: chartHeight }}>
        <Bar ref={chartRef} data={chartData} options={chartOptions} onClick={handleBarClick} />
      </div>
      {(selectedYear || selectedMonth) && (
        <button className="back-button" onClick={handleBackClick}>
          Back
        </button>
      )}
    </div>
  );
};

export default LibrarySidebar;