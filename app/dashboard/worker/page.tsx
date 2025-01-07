"use client";
import React from "react";
import { auth } from "../../../config/firebase"; // Ensure your Firebase config is correctly imported
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function WorkerDashboard() {
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
    <div>
      <h1>Worker Dashboard</h1>
      <p>Welcome, Worker! Here are your tasks and schedules.</p>
      <button
        onClick={handleSignOut}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}
