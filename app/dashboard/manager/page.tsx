"use client";
import React from "react";
import { auth } from "../../../config/firebase"; // Ensure your Firebase config is correctly imported
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ManagerDashboard() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to login page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
      alert("An error occurred while signing out. Please try again.");
    }
  };

  return (
    <div className="relative bg-[#F7FAFC]/70 backdrop-blur-md shadow-lg h-full border border-gray-300 rounded-3xl p-6 mr-3 flex flex-col">
      <h1 className="text-xl font-bold mb-4">Manager Dashboard</h1>
      <p className="mb-6">
        Welcome, Manager! Here's an overview of your team and reports.
      </p>
      <button
        onClick={handleSignOut}
        className="mt-4 px-4 py-2 w-24 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}
