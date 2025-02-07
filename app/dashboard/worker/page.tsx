"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainColorButton from "../../components/MainColorButton";
import StaticSchedule from "../components/StaticSchedule";
export default function WorkerDashboard() {
  return (
    <div className="relative  h-full flex flex-col">
      <h1 className="text-xl font-bold font-sans mb-4">Worker Dashboard</h1>

      <div className="w-full max-w-full h-[550px]">
        <div className="w-full h-full overflow-auto rounded-lg  ">
          <div className="min-w-[800px] h-full">
            <StaticSchedule />
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="mt-6">
        {/* Buttons Section */}
        <div className="mb-6 flex gap-4">
          {/* <button
            onClick={addShift}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Add Shift
          </button> */}
          {/* <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
            Reports
          </button> */}
          <MainColorButton
            label="Assign shifts"
            href="/dashboard/worker/worker-availability"
          />

          {/* <button className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600">
            New Schedule
          </button> */}
        </div>
      </footer>
    </div>
  );
}
