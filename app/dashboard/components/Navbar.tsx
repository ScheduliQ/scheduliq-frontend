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
  const [isLoaded, setIsLoaded] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const userId = uid;
  // const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // console.log("im here");
        // console.log("User ID:", userId);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/get_all/${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch notifications");
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
        // console.log("Unread Count:", data.unread_count);
      } catch (error) {
        // console.error("Error fetching notifications:", error);
      }
    };
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/userdata/${userId}`
        );
        if (!userResponse.ok) throw new Error("Failed to user data");
        const data = await userResponse.json();
        setUserData(data);
        // setHasMounted(true);
      } catch (error) {}
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    const socket = initiateSocketConnection();
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

  // if (!hasMounted) {
  //   return (
  //     <div className="flex items-center justify-center h-full">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="relative bg-white z-10  shadow-lg    w-full ">
      <div className="flex justify-between items-center px-6 py-2">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Image src="/logo.png" alt="logo" width={150} height={60} />
          </Link>
        </div>

        {/* פעולות */}
        <div className="flex items-center space-x-4">
          {/* Dropdown התראות */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle"
              onClick={markNotificationsRead}
            >
              <div className="indicator">
                {/* אייקון ההתראות */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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

                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full shadow-md">
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
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center ">
                    <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-[#014DAE]"></div>
                  </div>
                )}
                <img
                  alt="Profile Picture"
                  src={userData?.profile_picture}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setIsLoaded(true)}
                />{" "}
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
