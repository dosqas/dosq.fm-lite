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
    const labels = sortedEntries.map(([key]) => key);
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
    const minHeight = 200; 
    const heightPerItem = 20; 
    return Math.max(minHeight, numItems * heightPerItem);
  }, [allMonths, allDaysInMonth, selectedYear, selectedMonth]);

  const chartOptions = useMemo(() => {
    return {
      indexAxis: "y" as const, 
      responsive: true,
      maintainAspectRatio: false, 
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: selectedYear
            ? selectedMonth
              ? `Songs by Day (${selectedYear}-${selectedMonth})`
              : `Songs by Month (${selectedYear})`
            : "Songs by Year",
        },
      },
      hover: {
        mode: "nearest" as const, 
        intersect: true,
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1, 
            callback: (value: number | string) => `${value}`, 
          },
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
        onMonthSelect(label);
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
      <h3>Filter by Date</h3>

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