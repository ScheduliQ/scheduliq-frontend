"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../config/firebase";
import { useRole } from "../../../hooks/RoleContext";
import { initiateSocketConnection } from "../../../hooks/socket"; // SOCKET: Import socket functions
import { Socket } from "socket.io-client"; // SOCKET: Import Socket type

export default function Navbar() {
  const router = useRouter();
  const { role, uid, setRole } = useRole();
  interface Notification {
    _id: string;
    message: string;
    data: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  const userId = uid;

  // בעת טעינת הרכיב – טוענים את 5 ההתראות האחרונות וספירת ההתראות שלא נקראו
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("im here");
        console.log("User ID:", userId);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/get_all/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
        console.log("Unread Count:", data.unread_count);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  // מאזין לאירועי Socket.IO לקבלת התראות בזמן אמת
  useEffect(() => {
    const socket = initiateSocketConnection(); // SOCKET: Initiate connection
    socketRef.current = socket;
    if (!socket) {
      console.log("Socket not connected, initiating connection...");
    } else {
      console.log("Socket connection established");
      const handleNewNotification = (payload: any) => {
        // payload יכול להכיל את ההתראה החדשה וגם את הספירה המעודכנת (אם השרת שולח unread_count)
        setNotifications((prev) => [payload.notification, ...prev]);
        if (payload.unread_count !== undefined) {
          setUnreadCount(payload.unread_count);
        } else {
          setUnreadCount((prev) => prev + 1);
        }
      };

      if (socket) {
        console.log("Socket listener added for notifications");
        socket.on("notification", handleNewNotification);
      }
      return () => {
        if (socket) {
          socket.off("notification", handleNewNotification);
        }
      };
    }
  }, []);

  // פונקציה לסימון כל ההתראות כנקראות – מופעלת בעת לחיצה על אייקון ההתראות
  const markNotificationsRead = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/mark_read/${userId}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to mark notifications as read");
      await response.json();
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setRole(null);
      localStorage.removeItem("userRole");
      router.push("/login"); // ניתוב מחדש לדף כניסה
    } catch (error) {
      console.error("Error signing out:", error);
      alert("An error occurred while signing out. Please try again.");
    }
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (activeElement && activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }, 0);
  };

  const blurActiveElement = () =>
    setTimeout(() => {
      const activeElement = document.activeElement;
      if (activeElement && activeElement instanceof HTMLElement) {
        activeElement.blur();
      }
    }, 0);

  return (
    <div className="relative bg-[#F7FAFC]/70 z-10 backdrop-blur-md shadow-lg border border-gray-300 rounded-3xl w-full mx-4">
      <div className="flex justify-between items-center px-6 py-2">
        {/* לוגו */}
        <div className="flex items-center">
          <Link href="/dashboard">
            <Image src="/logo.png" alt="logo" width={150} height={60} />
          </Link>
        </div>

        {/* פעולות */}
        <div className="flex items-center space-x-4">
          {/* Dropdown התראות */}
          <div className="dropdown dropdown-end">
            {/* לחיצה על האייקון מפעילה את markNotificationsRead */}
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle"
              onClick={markNotificationsRead}
            >
              <div className="indicator">
                {/* אייקון ההתראות */}
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
                {/* אם יש התראות שלא נקראו – מציגים badge עם מספר */}
                {unreadCount > 0 && (
                  <span className="badge badge-xs badge-primary indicator-item">
                    {unreadCount}
                  </span>
                )}
              </div>
            </label>
            <div
              tabIndex={0}
              className="mt-3 card card-compact dropdown-content w-72 bg-[#F7FAFC] backdrop-blur-md shadow-md"
            >
              <div className="card-body">
                <span className="font-bold text-lg">Notifications</span>
                <ul>
                  {notifications.length > 0 ? (
                    notifications.map((notif: any) => (
                      <li
                        key={notif._id}
                        className="py-1 border-b border-gray-200"
                      >
                        <p className="text-md">{notif.message}</p>
                        <p className="text-sm">{notif.data}</p>
                      </li>
                    ))
                  ) : (
                    <li className="py-1 text-sm">Empty</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Dropdown פרופיל */}
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
                  <Link
                    href="/dashboard/manager/manager-settings"
                    className="justify-between"
                    onClick={blurActiveElement}
                  >
                    Manager Settings
                  </Link>
                </li>
              )}
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
