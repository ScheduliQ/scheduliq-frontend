"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../config/firebase"; // עדכן את הנתיב לפי ההגדרות שלך
import { useRole } from "../../../hooks/RoleContext"; // עדכן את הנתיב לפי הקובץ שלך

export default function Navbar() {
  const router = useRouter();
  const { role, setRole } = useRole();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // clear the role from the context
      setRole(null);
      // delete the role from localStorage
      localStorage.removeItem("userRole");

      router.push("/login"); // Redirect to login page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
      alert("An error occurred while signing out. Please try again.");
    }
  };
  const blurActiveElement = () =>
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (activeElement && activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }, 0);
  return (
    // bg-[#F7FAFC]/70
    <div className="relative bg-[#F7FAFC]/70 z-10 backdrop-blur-md shadow-lg border border-gray-300 rounded-3xl w-full mx-4">
      <div className="flex justify-between items-center px-6 py-2">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/dashboard">
            <Image src="/logo.png" alt="logo" width={150} height={60} />
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* Example notification badge */}
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>

          {/* Profile Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Profile Picture"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#F7FAFC] backdrop-blur-md rounded-box z-[1] mt-3 w-52 p-2 shadow-md"
            >
              <li>
                <Link
                  href="/dashboard/profile-page"
                  className="justify-between"
                  onClick={blurActiveElement}
                >
                  View Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/user-setting"
                  className="justify-between"
                  onClick={blurActiveElement}
                >
                  General Settings
                </Link>
              </li>
              {role === "manager" && (
                <li>
                  <a>Manager Settings</a>
                </li>
              )}
              <li>
                <a>Help & Support</a>
              </li>
              <li>
                <a onClick={handleSignOut}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
