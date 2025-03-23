import React, { useMemo, useRef } from "react";
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
  groupedData: { [key: string]: number }; 
  onYearSelect: (year: string | null) => void;
  onMonthSelect: (month: string | null) => void;
  onDaySelect: (day: string | null) => void;
  selectedYear: string | null;
  selectedMonth: string | null;
}

const LibrarySidebar: React.FC<LibrarySidebarProps> = ({
  groupedData,
  onYearSelect,
  onMonthSelect,
  onDaySelect,
  selectedYear,
  selectedMonth,
}) => {
  const chartRef = useRef<any>(null);

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
    
      console.log("Selected Year:", selectedYear);
      console.log("Selected Month:", selectedMonth);
    
      if (!selectedYear) {
        console.log("Year Label:", key);
        return key;
      } else if (!selectedMonth) {
        const monthIndex = parseInt(key, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          console.log("Month Label:", `${monthNames[monthIndex]} ${selectedYear}`);
          return `${monthNames[monthIndex]} ${selectedYear}`;
        } else {
          console.warn(`Invalid month key: ${key}`);
          return key; 
        }
      } else {
        console.log("Day Label:", `${key} ${monthNames[parseInt(selectedMonth, 10) - 1]}`);
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
  
      console.log("Clicked Label:", label);
  
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
        console.log("Parsed Month:", numericMonth);
        onMonthSelect(numericMonth); 
      } else {
        onDaySelect(label);
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