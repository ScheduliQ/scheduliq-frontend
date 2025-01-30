"use client";
import React, { useEffect, useState } from "react";
import { auth } from "../../../config/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Enables drag-and-drop
import timeGridPlugin from "@fullcalendar/timegrid";
import MainColorButton from "../../components/MainColorButton";
import RegularButton from "../../components/RegularButton";
import useSessionGuard from "../../../hooks/useSessionGuard";
import { useRole } from "../../../hooks/RoleContext";
import ShiftScheduler from "../components/ShiftScheduler";
export default function ManagerDashboard() {
  return (
    <div className="relative h-full flex flex-col">
      <h1 className="text-xl font-bold font-sans  mb-4">Manager Dashboard</h1>

      <div className=" w-full max-w-full h-[550px]">
        {/* קבע גובה מקסימלי קבוע */}
        <div className="w-full h-full overflow-auto rounded-lg  ">
          <div className=" min-w-[800px] h-full">
            <ShiftScheduler />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className=" mt-6">
        {/* Buttons Section */}
        <div className="mb-6 flex gap-4">
          <MainColorButton label="New Schedule" href="/shift-schedule" />
          <RegularButton label="Reports" href="/reports" />
        </div>
      </footer>
    </div>
  );
}
