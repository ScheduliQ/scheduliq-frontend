"use client";
import React, { useState } from "react";
import { auth } from "../../../config/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Enables drag-and-drop
import timeGridPlugin from "@fullcalendar/timegrid";
import MainColorButton from "../../components/MainColorButton";

export default function WorkerDashboard() {
  const router = useRouter();

  return (
    <div className="relative  h-full flex flex-col">
      <h1 className="text-xl font-bold font-sans mb-4">Worker Dashboard</h1>

      {/* FullCalendar */}
      {/* Calendar Container */}
      <div className="w-full max-w-full h-[550px]">
        {/* קבע גובה מקסימלי קבוע */}
        <div className="w-full h-full overflow-auto rounded-lg  ">
          <div className="min-w-[800px] h-full">
            {/* מינימום רוחב למניעת דחיסה */}
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              droppable={true}
              headerToolbar={{
                start: "prev,today,next",
                center: "title",
                end: "",
              }}
              // eventDragStop={true}
              snapDuration="00:30:00"
              slotLabelInterval="04:00:00"
              slotLabelContent={(arg) => {
                const hour = new Date(arg.date).getHours();
                if (hour === 8) return "Morning";
                if (hour === 12) return "Afternoon";
                if (hour === 16) return "Evening";
                return "";
              }}
              expandRows={true}
              slotMinTime="08:00:00"
              slotMaxTime="22:00:00"
              allDaySlot={false}
              height="100%"
              eventContent={(eventInfo: any) => (
                <div
                  className="p-2 rounded w-full h-full"
                  style={{
                    backgroundColor: eventInfo.event.backgroundColor,
                  }}
                >
                  <div className="font-bold">{eventInfo.event.title}</div>
                  <div className="text-sm">
                    {new Date(eventInfo.event.start).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}{" "}
                    -
                    {new Date(eventInfo.event.end).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
              )}
            />
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
          <MainColorButton label="Assign shifts" href="/" />

          {/* <button className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600">
            New Schedule
          </button> */}
        </div>
      </footer>
    </div>
  );
}
