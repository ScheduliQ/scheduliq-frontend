"use client";
import React, { useEffect, useState } from "react";
import { auth } from "../../../config/firebase";
import { useRouter } from "next/navigation";
import MainColorButton from "../../components/MainColorButton";
import RegularButton from "../../components/RegularButton";
import ShiftScheduler from "../components/ShiftScheduler";
import StaticSchedule from "../components/StaticSchedule";
export default function ManagerDashboard() {
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
          <RegularButton label="Reports" href="/reports" />
        </div>
      </footer>
    </div>
  );
}
