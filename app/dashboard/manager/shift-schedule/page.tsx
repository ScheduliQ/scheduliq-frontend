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
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import EmployeeConstraintsButton from "../../components/EmployeeConstraintsButton";

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

const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <div className="flex flex-col items-center">
        <DotLottieReact
          src="/animations/loading.lottie"
          loop
          autoplay
          style={{ width: "250px", height: "250px" }}
        />
        <h2 className="text-xl font-sans text-indigo-700 mt-2">
          Generating...
        </h2>
      </div>
    </div>
  );
};

export default function ManagerDashboard() {
  const [scheduleData, setScheduleData] = useState(null);
  const [publishDays, setPublishDays] = useState<Day[]>([]);
  const [solutionText, setSolutionText] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      console.error("Error publishing schedule:", error);
    }
  };
  const handleGeneratedSchedule = async () => {
    // 1. Get socket & await connection
    const socket = initiateSocketConnection();
    if (!socket.connected) {
      await new Promise<void>((res) => socket.once("connect", res));
    }

    // 2. Show loading overlay
    setIsLoading(true);

    // Remove any existing listeners to prevent duplicates
    socket.off("schedule_ready");
    socket.off("schedule_error");

    // 3. Register listeners *first*
    socket.on("schedule_ready", ({ solution, text }) => {
      const parsed = JSON.parse(solution);
      setSolutionText(text);
      setScheduleData(parsed);
      setIsLoading(false); // Hide loading when done
      // ShowSwalAlert("success", "Schedule ready!");
    });

    // Add listener for schedule error
    socket.on("schedule_error", ({ error }) => {
      setIsLoading(false); // Hide loading when there's an error
      ShowSwalAlert("error", error || "Could not generate schedule");
    });

    // 4. Now enqueue the job
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/csp/generate-schedule`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ socket_id: socket.id }),
        }
      );
      if (response.status === 202) {
        // in prod we just wait for the socket event
        return;
      }
      // *** in dev, if you ever choose to return 200+payload, you can handle it here ***
      if (response.status === 200) {
        const result = await response.json();
        const parsed = JSON.parse(result.solution);
        setSolutionText(result.text);
        setScheduleData(parsed);
        setIsLoading(false); // Hide loading when done
        // ShowSwalAlert("success", "Schedule ready!");
      } else {
        const err = await response.json();
        setIsLoading(false); // Hide loading on error
        ShowSwalAlert("error", err.error || "Queue error");
      }
    } catch (e) {
      setIsLoading(false); // Hide loading on error
      ShowSwalAlert("error", "Network error");
      console.error(e);
    }
  };

  return (
    <div className="relative p-4 h-full flex flex-col">
      <div className="w-full max-w-full h-[550px] relative">
        {isLoading && <LoadingOverlay />}
        <div className="w-full h-full overflow-auto rounded-lg">
          <div className="min-w-[800px] h-full">
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
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
          <button
            onClick={handleGeneratedSchedule}
            className="
        relative
        px-6 py-3
        rounded-lg
        text-white
        font-sans
        bg-gradient-to-r
        from-blue-600
        to-blue-800
        transition-all
        duration-200
        hover:from-blue-700
        hover:to-blue-900
        disabled:opacity-50
        disabled:cursor-not-allowed
        w-full sm:w-auto
      "
          >
            <span className="flex items-center justify-center">
              <BsStars className="h-5 w-5 text-white animate-pulse mr-2" />
              <span className="font-semibold">Generate</span>
            </span>
          </button>
          <button
            onClick={handlePublish}
            className="px-6 py-3 rounded-lg text-white font-sans bg-blue-600 hover:bg-blue-700 active:bg-white active:text-blue-600 active:border-blue-600 border border-transparent transition-colors duration-200 focus:outline-none disabled:bg-blue-200 disabled:text-blue-300 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            Publish
          </button>

          <CarouselSwal pages={solutionText} />

          {/* Employee Constraints Button */}
          <EmployeeConstraintsButton />
        </div>
        <ChatBOT />
      </footer>
    </div>
  );
}
