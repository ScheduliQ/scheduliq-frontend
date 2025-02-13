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

  useEffect(() => {
    const fetchData = async () => {
      if (!uid) {
        setError("לא נמצא מזהה משתמש.");
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
      }
    };

    fetchData();
  }, [uid]);

  // אם לא התקבלו פרטי משתמש או שיש שגיאה – מציגים הודעת שגיאה
  if (error) {
    return <div>שגיאה: {error}</div>;
  }

  // במידה ולא התקבלו פרטי משתמש, נניח שאין נתונים להצגה
  if (!userDetails) {
    return;
  }

  return (
    <div className="flex flex-col md:flex-row lg:mt-16 gap-8 p-8 w-full h-full justify-center items-center">
      {/* תמונת פרופיל וכותרת */}
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          {userDetails.profile_picture ? (
            <img
              src={userDetails.profile_picture}
              alt="תמונת פרופיל"
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
              <svg
                className="w-24 h-24 text-gray-400"
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
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {userDetails.first_name} {userDetails.last_name}
        </h2>
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
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
            <span>{userDetails.jobs}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
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
            <span>{userDetails.business_id}</span>
          </div>
        </div>
      </div>

      {/* פרטי משתמש */}
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 md:mt-8">
        {/* אימייל */}
        <div className="flex items-center gap-4 bg-blue-50 rounded-xl p-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100">
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
          </div>
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div className="text-gray-800">{userDetails.email}</div>
          </div>
        </div>

        {/* טלפון */}
        <div className="flex items-center gap-4 bg-green-50 rounded-xl p-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100">
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
          </div>
          <div>
            <div className="text-sm text-gray-500">Phone</div>
            <div className="text-gray-800">{userDetails.phone}</div>
          </div>
        </div>

        {/* מגדר */}
        <div className="flex items-center gap-4 bg-purple-50 rounded-xl p-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-100">
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
          </div>
          <div>
            <div className="text-sm text-gray-500">Gender</div>
            <div className="text-gray-800">{userDetails.gender}</div>
          </div>
        </div>

        {/* תאריך הצטרפות */}
        <div className="flex items-center gap-4 bg-amber-50 rounded-xl p-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-100">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm text-gray-500">Joining Date</div>
            <div className="text-gray-800">
              {new Date(userDetails.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
