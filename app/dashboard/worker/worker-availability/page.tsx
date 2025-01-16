"use client";

import { useState, useEffect } from "react";

const INITIAL_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const INITIAL_SHIFTS = ["Morning", "Afternoon", "Evening"];
const MIN_SHIFTS_REQUIRED = 3; // Minimum shifts required to submit

export default function DynamicScheduleTable() {
  const [workDays, setWorkDays] = useState(6);
  const [shiftsPerDay, setShiftsPerDay] = useState(3);
  const [shiftNames, setShiftNames] = useState(INITIAL_SHIFTS);
  const [availability, setAvailability] = useState(
    Array.from({ length: shiftsPerDay }, () =>
      Array.from({ length: workDays }, () => false)
    )
  );
  const [constraints, setConstraints] = useState("");
  const [availableShiftsCount, setAvailableShiftsCount] = useState(0);

  const displayedDays = INITIAL_DAYS.slice(0, workDays);

  // Update available shifts count dynamically
  useEffect(() => {
    const count = availability.flat().filter(Boolean).length;
    setAvailableShiftsCount(count);
  }, [availability]);

  const toggleAvailability = (shiftIndex: number, dayIndex: number) => {
    setAvailability((prev) => {
      const newAvailability = [...prev];
      newAvailability[shiftIndex] = [...newAvailability[shiftIndex]];
      newAvailability[shiftIndex][dayIndex] =
        !newAvailability[shiftIndex][dayIndex];
      return newAvailability;
    });
  };

  const clearAll = () => {
    setAvailability(
      Array.from({ length: shiftsPerDay }, () =>
        Array.from({ length: workDays }, () => false)
      )
    );
    setConstraints("");
  };

  const saveDraft = () => {
    console.log("Saving draft:", { availability, constraints });
    alert("Draft saved!");
  };

  const submitAvailability = () => {
    if (availableShiftsCount < MIN_SHIFTS_REQUIRED) {
      alert(
        `You must select at least ${MIN_SHIFTS_REQUIRED} shifts to submit.`
      );
      return;
    }

    // Collect indices as tuples [shiftIndex, dayIndex] where availability is true
    const submissionData = {
      availability: availability.flatMap((row, shiftIndex) =>
        row
          .map((isAvailable, dayIndex) =>
            isAvailable ? [shiftIndex, dayIndex] : null
          )
          .filter(Boolean)
      ),
      constraints,
    };

    console.log("Submitting JSON:", JSON.stringify(submissionData, null, 2));
    alert("Schedule submitted! Check the console for the JSON output.");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans bg-none rounded-2xl">
      {/* Header */}
      <div className="mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold tracking-tight">
          Dynamic Schedule Table
        </h1>
        <p className="mt-2 text-blue-100">Manage your weekly availability</p>
      </div>

      {/* Shift Counter */}
      <div className="mb-6 font-sans text-center">
        <p
          className={`font-medium ${
            availableShiftsCount < MIN_SHIFTS_REQUIRED
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          Selected Shifts: {availableShiftsCount} / {MIN_SHIFTS_REQUIRED}{" "}
          minimum required
        </p>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl font-sans border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 tracking-wider border-b border-r border-gray-200">
                <div className="flex items-center space-x-2">
                  <span>Shifts</span>
                </div>
              </th>
              {displayedDays.map((day, index) => (
                <th
                  key={`day-${index}`}
                  className="px-6 py-4 text-center text-sm font-semibold text-gray-600 tracking-wider border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white"
                >
                  <div className="flex flex-col">
                    <span className="text-gray-800">{day}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: shiftsPerDay }).map((_, shiftIndex) => (
              <tr key={`shift-${shiftIndex}`}>
                <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 bg-gray-50">
                  <div className="text-sm font-medium text-gray-900">
                    {shiftNames[shiftIndex] || `Shift ${shiftIndex + 1}`}
                  </div>
                </td>
                {displayedDays.map((_, dayIndex) => (
                  <td
                    key={`cell-${shiftIndex}-${dayIndex}`}
                    className="p-0 text-center border border-gray-100"
                  >
                    <button
                      onClick={() => toggleAvailability(shiftIndex, dayIndex)}
                      className={`
                        w-full h-full px-6 py-4
                        transition-all duration-200 ease-in-out
                        focus:outline-none
                        active:scale-95
                        ${
                          availability[shiftIndex][dayIndex]
                            ? "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600"
                            : "bg-white hover:bg-gray-50 text-gray-300"
                        }
                      `}
                    >
                      <span className="font-medium font-sans">
                        {availability[shiftIndex][dayIndex] ? "Available" : "X"}
                      </span>
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Constraints Text Area */}
      <div className="mt-8">
        <label className="block mb-2 font-semibold text-gray-700">
          Additional Constraints
        </label>
        <textarea
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          placeholder="Enter any specific constraints or preferences..."
          className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
        ></textarea>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end mt-6">
        <button
          onClick={clearAll}
          className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
        >
          Clear All
        </button>
        <button
          onClick={saveDraft}
          className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
        >
          Save Draft
        </button>
        <button
          onClick={submitAvailability}
          disabled={availableShiftsCount < MIN_SHIFTS_REQUIRED}
          className={`px-4 py-2 rounded text-white transition-colors ${
            availableShiftsCount < MIN_SHIFTS_REQUIRED
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
