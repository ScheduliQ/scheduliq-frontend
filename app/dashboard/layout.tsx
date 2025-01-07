import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen flex flex-col bg-[#FCE6D4]">
      {/* Navbar */}
      <div className="relative z-50  h-20 pt-1 flex items-center justify-center ">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Container */}
        <div className="w-full  md:w-1/4 lg:w-1/5 p-4">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1  p-4">
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
  );
}
