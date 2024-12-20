"use client";
import useSessionGuard from "../../hooks/useSessionGuard";
import { useState, useEffect } from "react";
import axios from "axios";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation"; // Import router for navigation
import { auth } from "../../config/firebase"; // Adjust path based on your setup

export default function Dashboard() {
  const user = useSessionGuard(); // Checks session guard
  const router = useRouter(); // Initialize the router instance

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // Ensure the user is defined before making the request

    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/dashboard"
        );
        setMessage(response.data.message); // Save the message from the response
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]); // Add `user` as a dependency

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/login"); // Use Next.js router for navigation
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user || loading) {
    return <p>Loading...</p>; // Show loading while waiting for session or data
  }

  return (
    <main>
      <h1 className="text-2xl">Welcome to the Dashboard!</h1>
      <p>You are logged in as: {message}</p>
      <button
        onClick={handleSignOut}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Sign Out
      </button>
    </main>
  );
}
