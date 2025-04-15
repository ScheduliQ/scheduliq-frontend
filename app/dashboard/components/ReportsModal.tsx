"use client";

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Bar, Pie } from "react-chartjs-2";
import InfoButton from "./InfoButton";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Define interfaces for the reports data
interface AverageEmployees {
  average: number;
}

interface RoleCoverage {
  actual: number;
  required: number;
}

interface ReportsData {
  average_employees_per_shift: AverageEmployees;
  employee_shift_count: Record<string, number>;
  role_coverage: Record<string, RoleCoverage>;
  shifts_by_type: Record<string, number>;
}

interface ReportsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

// // InfoButton component shows a tooltip when clicked
// const InfoButton: React.FC<{ infoText: string }> = ({ infoText }) => {
//   const [visible, setVisible] = useState(false);

//   return (
//     <div className="relative inline-block">
//       <button
//         onClick={() => setVisible(!visible)}
//         className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
//         aria-label="More information"
//       >
//         <svg
//           className="w-8 h-8"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M13 16h-1v-4h-1m1-4h.01M12 12h.01"
//           />
//         </svg>
//       </button>
//       {visible && (
//         <div
//           className="absolute z-[9999] p-2 bg-gray-700 text-white text-xs rounded-md shadow-md top-full left-1/2 transform -translate-x-1/2 mt-2 max-w-md"
//           style={{ whiteSpace: "normal" }}
//         >
//           {infoText}
//         </div>
//       )}
//     </div>
//   );
// };

const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Set app element using document.body for accessibility
  const appEl = typeof document !== "undefined" ? document.body : undefined;

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/reports/general`)
        .then((res) => res.json())
        .then((data: ReportsData) => {
          setReports(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch reports");
          setLoading(false);
        });
    }
  }, [isOpen]);

  // Modern color palette - brighter colors for better readability
  const colorPalette = {
    primary: ["rgba(79, 70, 229, 1)", "rgba(129, 140, 248, 1)"],
    secondary: ["rgba(6, 182, 212, 1)", "rgba(103, 232, 249, 1)"],
    accent: ["rgba(245, 158, 11, 1)", "rgba(252, 211, 77, 1)"],
    neutral: ["rgba(75, 85, 99, 1)", "rgba(156, 163, 175, 1)"],
    success: ["rgba(16, 185, 129, 1)", "rgba(110, 231, 183, 1)"],
    warning: ["rgba(217, 119, 6, 1)", "rgba(251, 191, 36, 1)"],
    danger: ["rgba(220, 38, 38, 1)", "rgba(248, 113, 113, 1)"],
  };

  const generateColors = (count: number) => {
    const colors = [];
    const colorKeys = Object.keys(colorPalette) as Array<
      keyof typeof colorPalette
    >;
    for (let i = 0; i < count; i++) {
      const colorKey = colorKeys[i % colorKeys.length];
      colors.push(colorPalette[colorKey][i % 2]); // Alternate between shades
    }
    return colors;
  };

  // Prepare data for the "Shifts by Type" pie chart - switched from doughnut to pie for better readability
  const shiftTypeLabels = reports ? Object.keys(reports.shifts_by_type) : [];
  const shiftTypeValues = reports ? Object.values(reports.shifts_by_type) : [];

  const shiftsByTypeData = {
    labels: shiftTypeLabels,
    datasets: [
      {
        label: "Shifts Count",
        data: shiftTypeValues,
        backgroundColor: generateColors(shiftTypeLabels.length),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const totalShifts = shiftTypeValues.reduce((sum, count) => sum + count, 0);

  // Sort employee shift count data by value (descending)
  const employeeLabels = reports
    ? Object.keys(reports.employee_shift_count)
        .sort(
          (a, b) =>
            reports.employee_shift_count[b] - reports.employee_shift_count[a]
        )
        .slice(0, 10) // Top 10 employees for better visualization
    : [];

  const employeeValues = employeeLabels.map(
    (label) => reports?.employee_shift_count[label] || 0
  );

  const employeeShiftCountData = {
    labels: employeeLabels,
    datasets: [
      {
        label: "Shift Count",
        data: employeeValues,
        backgroundColor: colorPalette.secondary[0],
        borderRadius: 4,
      },
    ],
  };

  const roleCoverageLabels = reports ? Object.keys(reports.role_coverage) : [];
  const roleCoverageActual = reports
    ? roleCoverageLabels.map((role) => reports.role_coverage[role].actual)
    : [];
  const roleCoverageRequired = reports
    ? roleCoverageLabels.map((role) => reports.role_coverage[role].required)
    : [];

  const roleFulfillmentPercentages = roleCoverageLabels.map((role, index) => {
    if (!reports) return 0;
    const actual = reports.role_coverage[role].actual;
    const required = reports.role_coverage[role].required;
    return required > 0 ? Math.round((actual / required) * 100) : 100;
  });

  const roleCoverageData = {
    labels: roleCoverageLabels,
    datasets: [
      {
        label: "Actual",
        data: roleCoverageActual,
        backgroundColor: colorPalette.primary[0],
        borderRadius: 4,
      },
      {
        label: "Required",
        data: roleCoverageRequired,
        backgroundColor: colorPalette.accent[0],
        borderRadius: 4,
      },
    ],
  };

  const averageEmployees =
    reports && reports.average_employees_per_shift
      ? reports.average_employees_per_shift.average.toFixed(1)
      : "0";

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 14,
            weight: "bold" as const,
          },
          color: "#333",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#333",
        padding: 12,
        cornerRadius: 8,
        bodyFont: { size: 14 },
        titleFont: { size: 16, weight: "bold" as const },
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#333", font: { weight: "bold" as const } },
      },
      y: {
        grid: { color: "rgba(226, 232, 240, 0.7)" },
        ticks: { color: "#333", font: { weight: "bold" as const } },
      },
    },
  };

  const horizontalBarOptions = {
    ...chartOptions,
    indexAxis: "y" as const,
    plugins: { ...chartOptions.plugins, legend: { display: false } },
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        position: "right" as const,
        labels: {
          font: { size: 14, weight: "bold" as const },
          color: "#333",
          padding: 20,
        },
      },
    },
  };

  const shiftTypeBreakdown = shiftTypeLabels.map((label, index) => ({
    type: label,
    count: shiftTypeValues[index],
    percentage: ((shiftTypeValues[index] / totalShifts) * 100).toFixed(1),
    color: generateColors(shiftTypeLabels.length)[index],
  }));

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      appElement={appEl}
      contentLabel="Reports Modal"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50"
      style={{
        content: {
          position: "relative",
          border: "none",
          background: "transparent",
          overflow: "visible",
          borderRadius: "0",
          outline: "none",
          padding: "0",
        },
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Shift Analytics Dashboard
            <InfoButton infoText="This dashboard gives you an overall view of key metrics and trends. 'Average Employees per Shift' shows the average number of staff assigned across all shifts. 'Total Shifts' is the total count of shifts available, while the other sections provide breakdowns by shift type and role coverage." />
          </h2>
          <button
            onClick={onRequestClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-100 px-6 bg-white sticky top-0 z-10">
          <div className="flex space-x-6">
            <button
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "employees"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("employees")}
            >
              Employee Data
            </button>
            <button
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "roles"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("roles")}
            >
              Role Coverage
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3">
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Overview Tab Content */}
          <div className={activeTab === "overview" ? "block" : "hidden"}>
            {reports && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-rows-1 sm:grid-rows-2 gap-4">
                  {/* Average Employees per Shift */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium opacity-90 flex items-center">
                          Average Employees per Shift
                          <InfoButton infoText="This metric calculates the average number of employees assigned per shift across all schedules." />
                        </h3>
                        <p className="text-3xl font-bold mt-2">
                          {averageEmployees}
                        </p>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Total Shifts Card */}
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium opacity-90 flex items-center">
                          Total Shifts
                          <InfoButton infoText="This shows the total number of shifts counted across all schedules." />
                        </h3>
                        <p className="text-3xl font-bold mt-2">{totalShifts}</p>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shifts by Type - Card Format */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      Shift Type Count
                    </h3>
                    <InfoButton infoText="This section breaks down shifts by type (e.g., morning, evening, night), showing count and percentage for each type." />
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {shiftTypeBreakdown.map((item) => (
                      <div
                        key={item.type}
                        className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="font-medium text-gray-800">
                            {item.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{item.count}</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Role Coverage Overview */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-800">
                      Role Coverage Overview
                    </h3>
                    <InfoButton infoText="This section shows how well each role is covered. 'Actual' represents current assignments, 'Required' includes unfilled positions. The percentage indicates fulfillment, and the status indicates if any roles need attention." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roleCoverageLabels.map((role, index) => {
                      const percentage = roleFulfillmentPercentages[index];
                      let colorClass = "bg-green-500";
                      if (percentage < 70) colorClass = "bg-red-500";
                      else if (percentage < 90) colorClass = "bg-amber-500";

                      return (
                        <div key={role} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-700">
                              {role}
                            </h4>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${colorClass}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {roleCoverageActual[index]} of{" "}
                            {roleCoverageRequired[index]} shifts covered
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Employee Tab Content */}
          <div className={activeTab === "employees" ? "block" : "hidden"}>
            {reports && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      Top 10 Employees by Shift Count
                    </h3>
                    <InfoButton infoText="This chart displays the top 10 employees based on the number of shifts they have been assigned. It helps identify the most frequently scheduled employees." />
                  </div>
                  <div className="h-96">
                    <Bar
                      data={employeeShiftCountData}
                      options={horizontalBarOptions}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-gray-800">
                      Employee Shift Details
                    </h3>
                    <InfoButton infoText="This table provides detailed information on the number of shifts each employee has been assigned." />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Employee
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Shift Count
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(reports.employee_shift_count)
                          .sort(([, a], [, b]) => b - a)
                          .map(([employee, count], index) => (
                            <tr
                              key={employee}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                {employee}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {count}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Roles Tab Content */}
          <div className={activeTab === "roles" ? "block" : "hidden"}>
            {reports && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      Role Coverage (Actual vs Required)
                    </h3>
                    <InfoButton infoText="This chart shows the difference between the actual assignments and the required staff for each role. It helps you see which roles are under-covered." />
                  </div>
                  <div className="h-96">
                    <Bar data={roleCoverageData} options={chartOptions} />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800">
                      Role Coverage Details
                    </h3>
                    <InfoButton infoText="This table details the role coverage by comparing the actual number of assignments to the required number for each role, along with a coverage percentage and status indicator." />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Role
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actual
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Required
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Coverage
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {roleCoverageLabels.map((role, index) => {
                          const actual = roleCoverageActual[index];
                          const required = roleCoverageRequired[index];
                          const percentage =
                            required > 0
                              ? Math.round((actual / required) * 100)
                              : 100;

                          let statusColor = "bg-green-100 text-green-800";
                          let statusText = "Fulfilled";

                          if (percentage < 70) {
                            statusColor = "bg-red-100 text-red-800";
                            statusText = "Critical";
                          } else if (percentage < 90) {
                            statusColor = "bg-amber-100 text-amber-800";
                            statusText = "Attention";
                          }

                          return (
                            <tr
                              key={role}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                {role}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {actual}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {required}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {percentage}%
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}
                                >
                                  {statusText}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportsModal;
