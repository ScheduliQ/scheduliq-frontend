"use client";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { useRole } from "../../../../hooks/RoleContext"; // Import Context

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
        console.log("managerSettings", settings);
        console.log("submissionStart", settings.submissionStart);
        console.log("submissionEnd", settings.submissionEnd);

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
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            };
            setSubmissionOpenMessage(
              `Submission opens on: ${submissionStartDate.toLocaleString(
                "en-US",
                options
              )}`
            );
            console.log("submissionOpenMessage", submissionOpenMessage);
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
        Swal.fire({
          icon: "success",
          title: "Success",
          text: result.message,
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        alert(`Failed to save draft: ${result.error || "Unknown error"}`);
        console.error("Error from server:", result);
      }
    } catch (error: any) {
      alert(`An unexpected error occurred: ${error.message}`);
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
          Swal.fire({
            icon: "error",
            title: "Error",
            // text: "No draft found, try saving one.",
            text: result.error,
            confirmButtonText: "Close",
            timer: 3000,
            timerProgressBar: true,
          });
        } else if (response.status === 403 && result.errorType === "OUTDATED") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.error,
            confirmButtonText: "Close",
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: result.error || "Error loading draft!",
            confirmButtonText: "Close",
            timer: 3000,
            timerProgressBar: true,
          });
        }
      }
    } catch (error: any) {
      console.error("Error loading draft:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || String(error),
        confirmButtonText: "Close",
      });
    }
  };

  const submitAvailability = async () => {
    if (availableShiftsCount < requiredShifts) {
      alert(`You must select at least ${requiredShifts} shifts to submit.`);
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
      Swal.fire({
        text: "Shift availability submitted successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        width: "300px",
        position: "center",
        background: "#f0f9ff",
        iconColor: "#014DAE",
        customClass: {
          popup: "rounded-lg shadow-md",
          title: "text-2xl font-sans font-semibold text-blue-700",
        },
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Error sending constraints!",
        icon: "error",
        confirmButtonText: "OK",
        timer: 3000,
        showConfirmButton: false,
        position: "center",
        width: "300px",
        background: "#fee2e2",
        iconColor: "#dc2626",
        customClass: {
          popup: "rounded-lg shadow-md",
          title: "text-2xl font-sans font-semibold text-red-700",
          htmlContainer: "font-sans text-gray-700",
        },
      });
      // console.error("Error sending constraints:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans bg-none rounded-2xl">
      {/* Header */}
      <div className="mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold tracking-tight">
          Dynamic Schedule Table
        </h1>
        <p className="mt-2 text-blue-100">
          Select the desired shifts by clicking on them and add additional
          constraints in the text box below if needed, then click 'Submit'.
        </p>
      </div>
      {/* Shift Counter */}
      <div className="mb-6 font-sans text-center">
        <p
          className={`font-medium ${
            availableShiftsCount < requiredShifts
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          Selected Shifts: {availableShiftsCount} / {requiredShifts} minimum
          required
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
              {displayedDays.map((day: any, index: any) => (
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
                {displayedDays.map((_: any, dayIndex: any) => (
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
          onClick={loadDraft}
          className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
        >
          Load Draft
        </button>
        {/* <button
          onClick={submitAvailability}
          disabled={availableShiftsCount < requiredShifts}
          className={`px-4 py-2 rounded text-white transition-colors ${
            availableShiftsCount < requiredShifts
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          Submit
        </button> */}
        <button
          onClick={submitAvailability}
          disabled={!isWithinWindow || availableShiftsCount < requiredShifts}
          className={`px-4 py-2 rounded text-white transition-colors ${
            !isWithinWindow || availableShiftsCount < requiredShifts
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          Submit
        </button>
        {!isWithinWindow && (
          <label className="mt-2 text-sm text-gray-600">
            {submissionOpenMessage}
          </label>
        )}
      </div>
    </div>
  );
}
