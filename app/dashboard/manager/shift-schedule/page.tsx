"use client";
import React, { useEffect, useRef, useState } from "react";
import { auth } from "../../../../config/firebase";
import { useRouter } from "next/navigation";
import { BsStars } from "react-icons/bs";
import ShiftScheduler from "../../components/ShiftScheduler";
import Swal from "sweetalert2";
import ChatBOT from "../../components/ChatBOT";
import CarouselSwal from "../../components/CarouselSwal"; // Adjust the import path as needed
import { initiateSocketConnection } from "@/hooks/socket";
import { Socket } from "socket.io-client"; // SOCKET: Import Socket type
import { ShowSwalAlert } from "@/app/dashboard/components/ShowSwalAlert";
interface Employee {
  id: string;
  name: string;
  role: string;
  hours: string;
}

interface Shift {
  id: string;
  time: string;
  employees: Employee[];
}

interface Day {
  id: string;
  name: string;
  shifts: Shift[];
}

export default function ManagerDashboard() {
  const [scheduleData, setScheduleData] = useState(null);
  const [publishDays, setPublishDays] = useState<Day[]>([]);
  const [solutionText, setSolutionText] = useState<[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const handlePublish = async () => {
    try {
      // console.log("publishDays", publishDays);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ days: publishDays }),
        }
      );
      if (!response.ok) throw new Error("Failed to publish schedule");
      ShowSwalAlert("success", "Schedule published successfully!");
      // Swal.fire({
      //   title: "Published!",
      //   icon: "success",
      //   timer: 2000,
      //   showConfirmButton: false,
      //   width: "300px",
      //   position: "center",
      //   background: "#f0f9ff",
      //   iconColor: "#014DAE",
      //   customClass: {
      //     popup: "rounded-lg shadow-md",
      //     title: "text-2xl font-sans font-semibold text-blue-700",
      //   },
      // });
      const socket = initiateSocketConnection(); // SOCKET: Initiate connection
      socketRef.current = socket;
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: socketRef.current?.id,
          message: "Published new schedule!",
          data: "",
        }),
      });
    } catch (error) {
      ShowSwalAlert("error", "Could not publish schedule!");
      // Swal.fire({
      //   title: "Error!",
      //   text: "Could not publish schedule!",
      //   icon: "error",
      //   confirmButtonText: "OK",
      //   timer: 3000,
      //   showConfirmButton: false,
      //   position: "center",
      //   width: "300px",
      //   background: "#fee2e2",
      //   iconColor: "#dc2626",
      //   customClass: {
      //     popup: "rounded-lg shadow-md",
      //     title: "text-2xl font-sans font-semibold text-red-700",
      //     htmlContainer: "font-sans text-gray-700",
      //   },
      // });
      console.error("Error publishing schedule:", error);
    }
  };

  const handleGeneratedSchedule = async () => {
    // 1. Get your socket
    const socket = initiateSocketConnection();

    // 2. Wait for it to actually connect, if not already
    if (!socket.connected) {
      await new Promise<void>((resolve) => {
        socket.once("connect", () => {
          resolve();
        });
      });
    }

    try {
      // 3. Enqueue the job
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/csp/generate-schedule`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ socket_id: socket.id }),
        }
      );

      if (response.status === 202) {
        ShowSwalAlert("success", "Schedule is being generated…");

        // 4. Listen once for the real result
        socket.once("schedule_ready", ({ solution, text }) => {
          const parsedData = JSON.parse(solution);
          setSolutionText(text);
          setScheduleData(parsedData);
          ShowSwalAlert("success", "Schedule Generated!");
        });
      } else {
        const err = await response.json();
        ShowSwalAlert("error", err.error || "Failed to queue schedule");
      }
    } catch (error) {
      ShowSwalAlert(
        "error",
        "Failed to generate schedule. Please try again later."
      );
      console.error("Error queuing schedule:", error);
    }
  };

  return (
    <div className="relative p-4 h-full flex flex-col">
      <div className=" w-full max-w-full h-[550px]">
        {/* קבע גובה מקסימלי קבוע */}
        <div className="w-full h-full overflow-auto rounded-lg  ">
          <div className=" min-w-[800px] h-full">
            <ShiftScheduler
              scheduleData={scheduleData}
              publishDays={publishDays}
              setPublishDays={setPublishDays}
            />{" "}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className=" mt-6">
        {/* Buttons Section */}
        <div className="flex space-x-4">
          <button
            onClick={handleGeneratedSchedule}
            className="
        relative
        px-6 py-3
        rounded-lg
        text-white
        font-sans
        bg-gradient-to-r
        from-[#18c4f2]
        to-[#a338e9]
        transition-all
        duration-200
        hover:opacity-90
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
          >
            <span className="flex items-center">
              <BsStars className="h-5 w-5 text-white animate-pulse mr-2" />
              <span className="font-semibold">Generate</span>
            </span>
          </button>
          {/* //second button!!!!! */}
          {/* <button className="px-6 py-3 rounded-lg text-[#014DAE] font-sans bg-white border border-[#014DAE] transition-colors duration-200 hover:bg-[#F0F5FF] hover:border-[#014DAE] hover:text-[#014DAE] active:bg-[#014DAE] active:text-white focus:outline-none disabled:bg-blue-200 disabled:text-blue-300 disabled:border-blue-200 disabled:cursor-not-allowed">
            Generate
          </button> */}
          {/* <button
            className="group flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-sans font-medium py-2.5 px-5 rounded-xl shadow-lg shadow-blue-400/20 hover:shadow-blue-500/30 transition-all duration-300 ease-out relative overflow-hidden"
            onClick={handleGeneratedSchedule}
          >
            <span className="relative z-10 flex items-center">
              <span className="mr-2.5">Generate Schedule</span>
              <BsStars className="h-5 w-5 text-yellow-200 animate-pulse" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 group-active:opacity-0 transition-opacity duration-300"></span>
            <span className="absolute -inset-px rounded-xl border border-blue-400/30 group-hover:border-blue-300/50 group-active:border-blue-400/80"></span>
          </button> */}
          <button
            onClick={handlePublish}
            className="px-6 py-3 rounded-lg text-white font-sans bg-[#0B8A59] border border-transparent transition-colors duration-200 hover:bg-[#086C45] active:bg-white active:text-[#0B8A59] active:border-[#0B8A59] focus:outline-none disabled:bg-green-200 disabled:text-green-300 disabled:cursor-not-allowed"
          >
            Publish
          </button>

          <CarouselSwal pages={solutionText} />
        </div>
        <ChatBOT />
      </footer>
    </div>
  );
}
