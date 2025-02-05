"use client";
import React, { useEffect, useState } from "react";
import { auth } from "../../../../config/firebase";
import { useRouter } from "next/navigation";
import { BsStars } from "react-icons/bs";
import ShiftScheduler from "../../components/ShiftScheduler";
import Swal from "sweetalert2";
export default function ManagerDashboard() {
  const [scheduleData, setScheduleData] = useState(null);

  const handleGeneratedSchedule = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/csp/generate-schedule`
      );
      if (!response.ok) throw new Error("Failed to fetch schedule");
      const result = await response.json();
      const parsedData = JSON.parse(result);
      setScheduleData(parsedData);
      Swal.fire({
        title: "Schedule Generated!",
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
        text: "Failed to generate schedule. Please try again later.",
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
      console.error("Error fetching schedule:", error);
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className=" w-full max-w-full h-[550px]">
        {/* קבע גובה מקסימלי קבוע */}
        <div className="w-full h-full overflow-auto rounded-lg  ">
          <div className=" min-w-[800px] h-full">
            <ShiftScheduler scheduleData={scheduleData} />{" "}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className=" mt-6">
        {/* Buttons Section */}
        <div className="flex space-x-4">
          <button
            className="flex items-center font-sans justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleGeneratedSchedule}
          >
            <span className="mr-2">Generate Schedule</span>
            {/* Star Icon */}
            <BsStars className="h-5 w-5" />
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-sans font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            Publish
          </button>
        </div>
      </footer>
    </div>
  );
}
