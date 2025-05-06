"use client";
import React, { useState, useEffect } from "react";
import { useRole } from "../../../hooks/RoleContext"; // ייבוא ה-Context
import { motion } from "framer-motion";

interface UserDetails {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile_picture: string;
  gender: string;
  jobs: string;
  business_id: string;
  created_at: string;
  role: string;
}

const UserProfilePage = () => {
  const { uid } = useRole();

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!uid) {
        setError("לא נמצא מזהה משתמש.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/userdata/${uid}`
        );
        if (!res.ok) {
          throw new Error("שגיאה בקריאת פרטי המשתמש");
        }
        const data = await res.json();

        if (data) {
          setUserDetails(data);
        } else {
          setError("לא נמצאו פרטי משתמש");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4 text-red-700 bg-red-50 rounded border-l-4 border-red-500">
        <p>שגיאה: {error}</p>
      </div>
    );
  }

  if (!userDetails) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6 pt-12"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile image and basic info */}
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="mb-6">
            {userDetails.profile_picture ? (
              <img
                src={userDetails.profile_picture}
                alt=" profile picture"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                <svg
                  className="w-20 h-20 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
            {userDetails.first_name} {userDetails.last_name}
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg shadow-sm">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">{userDetails.role}</span>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg shadow-sm">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span className="font-medium">{userDetails.business_id}</span>
            </div>
          </div>

          <div className="w-full text-center mt-2 mb-4">
            <p className="text-sm uppercase tracking-wide text-gray-500 mb-1">
              Member Since
            </p>
            <p className="font-medium text-gray-800">
              {new Date(userDetails.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* User details */}
        <div className="md:w-2/3">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
            Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium text-gray-700">Email</span>
              </div>
              <p className="mt-2 text-gray-800 break-all">
                {userDetails.email}
              </p>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="font-medium text-gray-700">Phone</span>
              </div>
              <p className="mt-2 text-gray-800">{userDetails.phone}</p>
            </motion.div>

            {/* Gender */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-purple-50 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-medium text-gray-700">Gender</span>
              </div>
              <p className="mt-2 text-gray-800 capitalize">
                {userDetails.gender}
              </p>
            </motion.div>

            {/* Role */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-amber-50 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="font-medium text-gray-700">Jobs</span>
              </div>
              <p className="mt-2 text-gray-800 capitalize">
                {userDetails.jobs || "User"}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfilePage;
