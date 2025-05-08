"use client";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useRole } from "../../../../hooks/RoleContext"; // Import Context
import { ShowSwalAlert } from "@/app/dashboard/components/ShowSwalAlert";

// Fallback defaults (will be replaced if manager settings are fetched)
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

export default function DynamicScheduleTable() {
  const { uid, role } = useRole();

  // Manager settings state (null until fetched)
  const [managerSettings, setManagerSettings] = useState<any>(null);

  // Dynamic state variables—default to fallback values until updated
  const [workDays, setWorkDays] = useState<number>(6);
  const [shiftsPerDay, setShiftsPerDay] = useState<number>(3);
  const [shiftNames, setShiftNames] = useState<string[]>(INITIAL_SHIFTS);

  // Availability matrix of size: shiftsPerDay x workDays
  const [availability, setAvailability] = useState<boolean[][]>(
    Array.from({ length: shiftsPerDay }, () =>
      Array.from({ length: workDays }, () => false)
    )
  );
  const [constraints, setConstraints] = useState("");
  const [availableShiftsCount, setAvailableShiftsCount] = useState(0);
  const [requiredShifts, setrequiredShifts] = useState(0);
  const [submissionOpenMessage, setSubmissionOpenMessage] = useState("");
  const [isWithinWindow, setIsWithinWindow] = useState(false);

  // Fetch manager settings from your backend and update states
  useEffect(() => {
    const fetchManagerSettings = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/manager-settings`
        );
        if (!response.ok) throw new Error("Failed to fetch manager settings");
        const settings = await response.json();
        setManagerSettings(settings);
        // Assume settings.work_days is an array of days and settings.shift_names is an array of shift names
        setWorkDays(settings.work_days.length);
        setShiftsPerDay(settings.shift_names.length);
        setShiftNames(settings.shift_names);
        setrequiredShifts(settings.required_shifts);
        // Reinitialize availability matrix based on the new dimensions
        setAvailability(
          Array.from({ length: settings.shift_names.length }, () =>
            Array.from({ length: settings.work_days.length }, () => false)
          )
        );
        const now = new Date();
        // console.log("managerSettings", settings);
        // console.log("submissionStart", settings.submissionStart);
        // console.log("submissionEnd", settings.submissionEnd);

        if (settings && settings.submissionStart && settings.submissionEnd) {
          const submissionStartDate = new Date(settings.submissionStart);
          const submissionEndDate = new Date(settings.submissionEnd);
          setIsWithinWindow(
            now >= submissionStartDate && now <= submissionEndDate
          );
          console.log("isWithinWindow", isWithinWindow);

          if (!isWithinWindow) {
            // Format the date in a user-friendly way
            const options: Intl.DateTimeFormatOptions = {
              weekday: "long",
              hour: "2-digit",
              minute: "2-digit",
            };
            const formatted = submissionStartDate.toLocaleString(
              "en-US",
              options
            ); // e.g. "Monday, 05:30 PM"
            setSubmissionOpenMessage(
              `Submission opens on: ${formatted.replace(",", " at")}`
            );
            // console.log("submissionOpenMessage", submissionOpenMessage);
          }
        }
      } catch (error) {
        console.error("Error fetching manager settings:", error);
      }
    };
    fetchManagerSettings();
  }, []);

  // Compute available shifts count whenever availability changes
  useEffect(() => {
    const count = availability.flat().filter(Boolean).length;
    setAvailableShiftsCount(count);
  }, [availability]);

  // Use dynamic work_days if available, otherwise fallback
  const displayedDays = managerSettings
    ? managerSettings.work_days
    : INITIAL_DAYS.slice(0, workDays);

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

  const saveDraft = async () => {
    try {
      const draftData = {
        uid,
        availability: availability.flatMap((row, shiftIndex) =>
          row
            .map((isAvailable, dayIndex) =>
              isAvailable
                ? { shift: shiftIndex, day: dayIndex, priority: 10 }
                : null
            )
            .filter(Boolean)
        ),
        constraints,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/constraints/save-draft`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draftData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        ShowSwalAlert("success", result.message);
      } else {
        ShowSwalAlert("error", result.error || "Unknown error");
        console.error("Error from server:", result);
      }
    } catch (error: any) {
      ShowSwalAlert("error", `An unexpected error occurred: ${error.message}`);
      console.error("Error saving draft:", error);
    }
  };

  const loadDraft = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/constraints/draft/${uid}`
      );
      const result = await response.json();

      if (response.ok && result.draft) {
        const updatedAvailability = Array.from({ length: shiftsPerDay }, () =>
          Array.from({ length: workDays }, () => false)
        );
        result.draft.availability.forEach(
          ({ shift, day }: { shift: number; day: number }) => {
            updatedAvailability[shift][day] = true;
          }
        );
        setAvailability(updatedAvailability);
        setConstraints(result.draft.constraints || "");
      } else {
        if (response.status === 404 && result.errorType === "NOT_FOUND") {
          ShowSwalAlert("error", result.error);
        } else if (response.status === 403 && result.errorType === "OUTDATED") {
          ShowSwalAlert("error", result.error);
        } else {
          ShowSwalAlert("error", result.error || "Error loading draft!");
        }
      }
    } catch (error: any) {
      console.error("Error loading draft:", error);
      ShowSwalAlert("error", error.message || String(error));
    }
  };

  const submitAvailability = async () => {
    if (availableShiftsCount < requiredShifts) {
      ShowSwalAlert(
        "error",
        `You must select at least ${requiredShifts} shifts to submit.`
      );
      return;
    }
    const submissionData = {
      uid,
      availability: availability.flatMap((row, shiftIndex) =>
        row
          .map((isAvailable, dayIndex) =>
            isAvailable
              ? { shift: shiftIndex, day: dayIndex, priority: 10 }
              : null
          )
          .filter(Boolean)
      ),
      constraints,
    };
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/constraints/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        }
      );
      const result = await response.json();
      ShowSwalAlert("success", "Shift availability submitted successfully!");
    } catch (error) {
      ShowSwalAlert("error", "Error sending constraints. Please try again.");
    }
  };

  return (
    <div className="container px-4 py-6 mx-auto max-w-6xl font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Shift Availability
        </h1>
        <p className="text-gray-600">
          Select your available shifts for the upcoming schedule. You must
          select at least {requiredShifts} shifts.
        </p>
      </div>

      {/* Shift Counter */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Selected Shifts:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                availableShiftsCount < requiredShifts
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {availableShiftsCount} / {requiredShifts} required
            </span>
          </div>

          {!isWithinWindow && (
            <div className="text-amber-600 bg-amber-50 px-4 py-2 rounded-md text-sm flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {submissionOpenMessage}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 tracking-wider border-b">
                  <div className="flex items-center space-x-2">
                    <span>Shifts</span>
                  </div>
                </th>
                {displayedDays.map((day: any, index: any) => (
                  <th
                    key={`day-${index}`}
                    className="px-6 py-4 text-center text-sm font-semibold text-gray-600 tracking-wider border-b"
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
                <tr key={`shift-${shiftIndex}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap border-r bg-gray-50">
                    <div className="text-sm font-medium text-gray-800">
                      {shiftNames[shiftIndex] || `Shift ${shiftIndex + 1}`}
                    </div>
                  </td>
                  {displayedDays.map((_: any, dayIndex: any) => (
                    <td
                      key={`cell-${shiftIndex}-${dayIndex}`}
                      className="p-2 text-center"
                    >
                      <button
                        onClick={() => toggleAvailability(shiftIndex, dayIndex)}
                        className={`
                          w-full h-12 md:h-14 rounded-md transition-all duration-200 
                          focus:outline-none focus:ring-2 focus:ring-offset-1
                          ${
                            availability[shiftIndex][dayIndex]
                              ? "bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-400"
                          }
                        `}
                        aria-label={
                          availability[shiftIndex][dayIndex]
                            ? "Available"
                            : "Not available"
                        }
                      >
                        {availability[shiftIndex][dayIndex] ? (
                          <span className="flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        ) : (
                          <span className="font-medium">—</span>
                        )}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Constraints Text Area */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <label className="block mb-3 font-medium text-gray-700">
          Additional Constraints
        </label>
        <textarea
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          placeholder="Enter any specific constraints or preferences you may have (e.g. 'I prefer to work mornings only')..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          rows={3}
        ></textarea>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-8 justify-end">
        <button
          onClick={clearAll}
          className="px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
        >
          Clear All
        </button>
        <button
          onClick={saveDraft}
          className="px-4 py-2 rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Save Draft
        </button>
        <button
          onClick={loadDraft}
          className="px-4 py-2 rounded-md border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Load Draft
        </button>
        <button
          onClick={submitAvailability}
          disabled={!isWithinWindow || availableShiftsCount < requiredShifts}
          className={`px-5 py-2 rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            !isWithinWindow || availableShiftsCount < requiredShifts
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          }`}
        >
          Submit Availability
        </button>
      </div>
    </div>
  );
}
