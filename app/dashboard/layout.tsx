"use client";
import { usePathname } from "next/navigation";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "../components/ProtectedRoute";
import BackButton from "../components/BackButton";

import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // Check if we're on the main dashboard page or excluded pages
  const isMainDashboard =
    pathname === "/dashboard" ||
    pathname === "/dashboard/worker" ||
    pathname === "/dashboard/manager";

  // אם המשתמש נמצא ב-'/dashboard/contact', אל תשתמש ב-Layout הזה
  if (
    pathname.startsWith("/dashboard/contact") ||
    pathname.startsWith("/dashboard/privacy-policy") ||
    pathname.startsWith("/dashboard/terms")
  ) {
    return (
      <div className="relative min-h-screen w-full overflow-x-hidden bg-[#f0f7ff]">
        <div className="relative z-50 flex items-center justify-center w-full">
          <Navbar />
        </div>
        <div className="relative w-full px-2 sm:px-4 max-w-full overflow-x-hidden">
          {!isMainDashboard && (
            <div className="my-2 mx-4">
              <BackButton />
            </div>
          )}
          {children}
        </div>{" "}
      </div>
    );
  } else if (pathname.startsWith("/dashboard/manager/manager-settings")) {
    return (
      <div className="min-h-screen flex flex-col w-full overflow-x-hidden bg-[#f0f7ff]">
        {/* Navbar */}
        <div className="relative z-50 flex items-center justify-center w-full">
          <Navbar />
        </div>
        <div className="relative w-full px-2 sm:px-4 max-w-full overflow-x-hidden">
          {!isMainDashboard && (
            <div className="my-2 mx-4">
              <BackButton />
            </div>
          )}
          {children}
        </div>{" "}
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen box-border w-full overflow-x-hidden bg-[#f0f7ff]">
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-full">
          {/* Header */}
          <header className="rounded-3xl shadow-md w-full">
            <Navbar />
          </header>

          {/* Content Row */}
          <div className="flex flex-1 flex-col mx-2 sm:mx-4 md:mx-6 md:flex-row gap-4 md:gap-x-8">
            <aside className="bg-white rounded-3xl  shadow-md p-3 sm:p-4 w-full md:w-1/4 mb-4 md:mb-0 max-w-full overflow-hidden">
              <Sidebar />
            </aside>
            <main className="bg-white rounded-3xl  shadow-xl p-3 sm:p-4 w-full md:w-3/4 max-w-full overflow-x-auto">
              {!isMainDashboard && (
                <div className="mb-4">
                  <BackButton />
                </div>
              )}
              <div className="w-full max-w-full">{children}</div>
            </main>
          </div>

          {/* Footer */}
          <footer className="rounded-3xl shadow-md mt-4 w-full">
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
