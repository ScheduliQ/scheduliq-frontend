"use client";
import React, { useEffect, useState } from "react";
import { auth } from "../../../config/firebase";
import { useRouter } from "next/navigation";
import MainColorButton from "../../components/MainColorButton";
import RegularButton from "../../components/RegularButton";
import StaticSchedule from "../components/StaticSchedule";
import ReportsModal from "../components/ReportsModal";
import { BarChart2 } from "lucide-react";
import { IoStatsChart } from "react-icons/io5";

export default function ManagerDashboard() {
  const [isReportsOpen, setIsReportsOpen] = useState<boolean>(false);

  const openReports = () => setIsReportsOpen(true);
  const closeReports = () => setIsReportsOpen(false);

  return (
    <div className="relative h-full flex flex-col">
      <h1 className="text-xl font-bold font-sans  mb-4">Manager Dashboard</h1>

      <div className=" w-full max-w-full h-[550px]">
        {/* קבע גובה מקסימלי קבוע */}
        <div className="w-full h-full overflow-auto rounded-lg  ">
          <div className=" min-w-[800px] h-full">
            <StaticSchedule />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className=" mt-6">
        {/* Buttons Section */}
        <div className="mb-6 flex gap-4">
          <MainColorButton
            label="New Schedule"
            href="/dashboard/manager/shift-schedule"
          />
          <button
            onClick={openReports}
            className="bg-transparent p-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
            aria-label="Open Reports"
          >
            <IoStatsChart size={24} />
          </button>
        </div>
      </footer>
      {isReportsOpen && (
        <ReportsModal isOpen={isReportsOpen} onRequestClose={closeReports} />
      )}
    </div>
  );
}
