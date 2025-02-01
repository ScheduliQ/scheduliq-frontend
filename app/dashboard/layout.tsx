"use client";
import { usePathname } from "next/navigation";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DynamicBackground from "../components/DynamicBackground";
import ProtectedRoute from "../components/ProtectedRoute";

import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // אם המשתמש נמצא ב-'/dashboard/contact', אל תשתמש ב-Layout הזה
  if (pathname.startsWith("/dashboard/contact")) {
    return (
      <div className="relative min-h-screen">
        <DynamicBackground /> {/* רקע דינמי */}
        <div className="relative z-10">{children}</div> {/* תוכן הדף */}
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col ">
        <DynamicBackground />
        {/* Navbar */}
        <div className="relative z-50 h-20 pt-1 flex items-center justify-center ">
          <Navbar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar Container */}
          <div className="w-full md:w-1/4 lg:w-1/5 p-4">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4">
            <div className="bg-[#F7FAFC]/70 backdrop-blur-md shadow-lg border border-gray-300 rounded-3xl p-6 h-full">
              <main>{children}</main>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto">
          <Footer />
        </footer>
      </div>
    </ProtectedRoute>
  );
}
