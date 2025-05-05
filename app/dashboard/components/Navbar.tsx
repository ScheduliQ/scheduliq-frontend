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
import { motion } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const { role, uid, setRole } = useRole();
  interface Notification {
    _id: string;
    message: string;
    data: string;
    read?: boolean;
  }
  const [isLoaded, setIsLoaded] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const userId = uid;
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
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
        // Mark notifications with read status based on server data
        const processedNotifications = data.notifications.map(
          (notification: Notification, index: number) => ({
            ...notification,
            read: index >= data.unread_count, // Mark only notifications beyond unread_count as read
          })
        );
        setNotifications(processedNotifications);
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
        setNotifications((prev) => [
          { ...payload.notification, read: false }, // Explicitly mark new notifications as unread
          ...prev,
        ]);
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

      // We no longer mark notifications as read in the UI here
      // This only clears the server-side count
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Set a notification as read on hover
  const handleNotificationHover = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Set all notifications as read when closing the dropdown
  const handleDropdownClose = () => {
    if (notificationDropdownOpen) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    }
    setNotificationDropdownOpen(false);
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
    <div className="relative bg-white z-10 shadow-lg w-full overflow-hidden">
      <div className="flex justify-between items-center px-2 sm:px-4 md:px-6 py-2">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Image
              src="/logo.png"
              alt="logo"
              width={120}
              height={48}
              className="w-24 sm:w-32 md:w-[150px]"
            />
          </Link>
        </div>

        {/* פעולות */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Dropdown התראות */}
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle relative group"
              onClick={() => {
                markNotificationsRead(); // This only clears the unread count on server
                setNotificationDropdownOpen(true);
                // We don't mark notifications as read visually here
              }}
            >
              <div className="indicator">
                {/* אייקון ההתראות */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 group-hover:text-blue-500 transition-colors duration-200"
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
                {/* ספירת ההתראות שאינן נקראות */}
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                    <span className="inline-flex items-center justify-center min-w-3 h-3 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm">
                      {unreadCount}
                    </span>
                  </span>
                )}
              </div>
            </label>
            <div
              tabIndex={0}
              className="dropdown-content mt-3 w-64 sm:w-80 overflow-hidden z-50 rounded-xl shadow-2xl border border-gray-100"
              onBlur={handleDropdownClose}
            >
              <div className="bg-white backdrop-blur-md">
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 text-white">
                  <h3 className="font-semibold flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
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
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                  </h3>
                </div>

                <div
                  className={`max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent`}
                >
                  {notifications.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {notifications.map((notif: any, index) => (
                        <motion.li
                          key={notif._id}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="hover:bg-blue-50 transition-colors duration-150"
                          onMouseEnter={() =>
                            handleNotificationHover(notif._id)
                          }
                        >
                          <div className="p-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 text-blue-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div>
                                <p
                                  className={`text-sm ${
                                    !notif.read ? "font-bold" : "font-medium"
                                  } text-gray-800`}
                                >
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notif.data}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-gray-300 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  )}
                </div>
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
