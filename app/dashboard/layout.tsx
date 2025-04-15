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
  if (
    pathname.startsWith("/dashboard/contact") ||
    pathname.startsWith("/dashboard/privacy-policy") ||
    pathname.startsWith("/dashboard/terms")
  ) {
    return (
      <div className="relative min-h-screen">
        <DynamicBackground /> {/* רקע דינמי */}
        <div className="relative z-50   flex items-center justify-center ">
          <Navbar />
        </div>
        <div className="relative">{children}</div> {/* תוכן הדף */}
      </div>
    );
  } else if (pathname.startsWith("/dashboard/manager/manager-settings")) {
    return (
      <div className="min-h-screen flex flex-col">
        <DynamicBackground />
        {/* Navbar */}
        <div className="relative z-50  flex items-center justify-center ">
          <Navbar />
        </div>{" "}
        <div className="relative">{children}</div> {/* תוכן הדף */}
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen  box-border">
        <DynamicBackground />

        <div className=" mx-auto flex flex-col gap-8 w-full">
          {/* Header */}
          <header className=" rounded-3xl shadow-md ">
            <Navbar />
          </header>

          {/* Content Row */}
          <div className="flex flex-1 h-full flex-col ml-6 mr-6 md:flex-row gap-x-8">
            <aside className="bg-white rounded-3xl shadow-md p-4 w-full md:w-1/4">
              <Sidebar />
            </aside>
            <main className="bg-white  rounded-3xl shadow-xl p-4 w-full md:w-3/4">
              {children}
            </main>
          </div>

          {/* Footer */}
          <footer className=" rounded-3xl shadow-md ">
            <Footer />
          </footer>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// <div className="min-h-screen flex flex-col ">
// <DynamicBackground />
// {/* Navbar */}
// <div className="relative z-50  flex items-center justify-center ">
//   <Navbar />
// </div>

// {/* Main Content Area */}
// <div className="flex-1 flex flex-col md:flex-row">
//   {/* Sidebar Container */}
//   <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/5 p-4">
//     <Sidebar />
//   </div>

//   {/* Main Content */}
//   <div className="flex-1 sm:w-3/4 md:w-3/4 lg:w-4/5 p-4">
//     <div className="bg-white backdrop-blur-md shadow-lg  rounded-xl p-6 h-full">
//       <main>{children}</main>
//     </div>
//   </div>
// </div>

// {/* Footer */}
// <footer className="mt-auto">
//   <Footer />
// </footer>
// </div>
