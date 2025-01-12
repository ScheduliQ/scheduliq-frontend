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
import RegularButton from "../../components/RegularButton";

// Enables time-based grid
export default function ManagerDashboard() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false); // Manage edit mode state

  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Morning Shift",
      start: "2025-01-08T08:00:00",
      end: "2025-01-08T12:00:00",
      color: "#FFA07A",
    },
    {
      id: "2",
      title: "Afternoon Shift",
      start: "2025-01-08T12:30:00",
      end: "2025-01-08T16:30:00",
      color: "#90EE90",
    },
    {
      id: "3",
      title: "Evening Shift",
      start: "2025-01-08T17:00:00",
      end: "2025-01-08T21:00:00",
      color: "#87CEEB",
    },
  ]);

  // Handle adding a new shift
  const addShift = () => {
    const newShift = {
      id: String(events.length + 1),
      title: "New Shift",
      start: "2025-01-08T10:00:00",
      end: "2025-01-08T14:00:00",
      color: "#FFD700",
    };
    setEvents([...events, newShift]);
  };

  // Handle event drop
  const handleEventDrop = (info: any) => {
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            start: info.event.start.toISOString(),
            end: info.event.end.toISOString(),
          }
        : event
    );
    setEvents(updatedEvents);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="relative  h-full flex flex-col">
      <h1 className="text-xl font-bold font-sans  mb-4">Manager Dashboard</h1>

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
              editable={isEditing}
              droppable={true}
              events={events}
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
              eventDrop={handleEventDrop}
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
          <button
            onClick={toggleEditMode}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            {isEditing ? "View Mode" : "Edit Mode"}
          </button>
          {/* <button
            onClick={addShift}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Add Shift
          </button> */}
          {/* <button className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
            Reports
          </button> */}
          <MainColorButton label="New Schedule" href="/shift-schedule" />

          <RegularButton label="Reports" href="/reports" />
          {/* <button className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600">
            New Schedule
          </button> */}
        </div>
      </footer>
    </div>
  );
}
