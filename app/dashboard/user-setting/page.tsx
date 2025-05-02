"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRole } from "../../../hooks/RoleContext"; // adjust path if needed
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Image from "next/image";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { ShowSwalAlert } from "@/app/dashboard/components/ShowSwalAlert";
import Footer from "../components/Footer";
import DynamicBackground from "../../components/DynamicBackground";

export default function SettingsPage() {
  const { uid } = useRole();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    profile_picture: "",
  });
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Fetch user data on component mount
  // Modify the useEffect that fetches user data
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      // Don't set an error here, just wait for uid
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/userdata/${uid}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data = await res.json();
        setUserDetails(data);
        const initialData = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          profile_picture: data.profile_picture || "",
        };
        setFormData(initialData);
        setInitialFormData(initialData);
        setError(null); // Clear any errors
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  // Forgot Password functionality
  const handleForgotPassword = async () => {
    setForgotMessage("");
    setForgotError("");
    setResetLoading(true);
    try {
      // setForgotLoading(true);
      await sendPasswordResetEmail(auth, userDetails.email);
      setForgotMessage("Password reset link has been sent to your email.");
    } catch (err: any) {
      if (err.code === "auth/invalid-email") {
        setForgotError(
          "Invalid email format. Something is wrong with your email."
        );
      } else if (err.code === "auth/user-not-found") {
        setForgotError("This email is not registered.");
      } else {
        setForgotError(
          "Failed to send password reset email. Please try again later."
        );
      }
    }
    setResetLoading(false);
  };

  // Handle file selection for profile picture
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes("image")) {
      setFieldErrors((prev: any) => ({
        ...prev,
        profile_picture: "Please select an image file.",
      }));
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev: any) => ({
        ...prev,
        profile_picture: "Image size should not exceed 5MB.",
      }));
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image.");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, profile_picture: data.url }));
      setFieldErrors((prev: any) => ({ ...prev, profile_picture: "" }));
    } catch (err: any) {
      setFieldErrors((prev: any) => ({
        ...prev,
        profile_picture: err.message || "Failed to upload image.",
      }));
    } finally {
      setIsUploading(false);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Check if form data has changed compared to initial data
  const isFormChanged = () => {
    if (!initialFormData) return false;
    return (
      formData.first_name !== initialFormData.first_name ||
      formData.last_name !== initialFormData.last_name ||
      formData.email !== initialFormData.email ||
      formData.phone !== initialFormData.phone ||
      formData.gender !== initialFormData.gender ||
      formData.profile_picture !== initialFormData.profile_picture
    );
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const nameRegex = /^[A-Za-z]+$/;

    // First Name
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name cannot be empty.";
    } else if (!nameRegex.test(formData.first_name)) {
      newErrors.first_name = "First name must contain only letters.";
    }

    // Last Name
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name cannot be empty.";
    } else if (!nameRegex.test(formData.last_name)) {
      newErrors.last_name = "Last name must contain only letters.";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email cannot be empty.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone
    const phoneRegex = /^[0-9]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number cannot be empty.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must contain only digits.";
    }

    // Gender
    if (
      formData.gender &&
      formData.gender !== "male" &&
      formData.gender !== "female" &&
      formData.gender !== "other"
    ) {
      newErrors.gender = "Invalid gender selection.";
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  // Submit the updated settings to the backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uid) {
      setError("User not found.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/userSetting/${uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update user details.");
      }

      const updatedUser = await res.json();
      setUserDetails(updatedUser);
      const updatedInitialData = {
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        profile_picture: updatedUser.profile_picture || "",
      };

      setInitialFormData(updatedInitialData);
      setMessage("Settings updated successfully!");

      ShowSwalAlert("success", "Settings updated successfully!");
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
      ShowSwalAlert("error", err.message);
    }
  };

  // Default profile image if none exists
  const getDefaultProfileImage = () => {
    return `https://ui-avatars.com/api/?name=${formData.first_name}+${formData.last_name}&background=random&color=fff&size=256`;
  };

  // Main loading spinner
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  // Error display for backend errors
  if (error && !loading && uid)
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );

  return (
    <div>
      <div className="mb-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-blue-800 mb-1">
            Profile Settings
          </h1>
          <p className="text-gray-500">
            Manage your personal information and account preferences
          </p>
        </motion.div>
      </div>

      {!uid && (
        <div className="text-center py-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-600">Loading user information...</p>
        </div>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-sm"
        >
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{message}</span>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className=" overflow-hidden"
      >
        <div className="grid md:grid-cols-[250px_1fr] gap-8 p-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center bg-gradient-to-b from-blue-50 to-white p-6 rounded-xl border border-blue-100 shadow-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-6 group"
            >
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white bg-blue-50 shadow-lg transition-all duration-300 hover:border-blue-200">
                {formData.profile_picture ? (
                  <img
                    src={formData.profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={getDefaultProfileImage()}
                    alt="Default Profile"
                    className="w-full h-full object-cover"
                  />
                )}

                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleUploadClick}
                disabled={isUploading}
                className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-110"
              >
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
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </motion.div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {fieldErrors.profile_picture && (
              <p className="text-red-500 text-sm mt-1 text-center">
                {fieldErrors.profile_picture}
              </p>
            )}

            <div className="text-center mt-2">
              <p className="font-semibold text-lg text-blue-800 mb-1">
                {formData.first_name} {formData.last_name}
              </p>
              <div className="flex items-center justify-center text-gray-500 text-sm mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-400 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  Member since{" "}
                  {userDetails &&
                    new Date(userDetails.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                </span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* First Name */}
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.1 }}
                      className="relative"
                    >
                      <label className="block mb-2 font-medium text-blue-800 text-sm">
                        First Name
                      </label>
                      <div
                        className={`relative flex items-center overflow-hidden rounded-lg shadow-sm border ${
                          focusedField === "first_name"
                            ? "border-blue-500 shadow-md ring-2 ring-blue-100"
                            : "border-blue-100"
                        } transition-all duration-200 bg-white hover:border-blue-200`}
                      >
                        <div className="flex items-center justify-center h-full px-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          onFocus={() => handleFocus("first_name")}
                          onBlur={handleBlur}
                          className="w-full px-4 py-3.5 bg-white/90 focus:outline-none"
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      {fieldErrors.first_name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          {fieldErrors.first_name}
                        </p>
                      )}
                    </motion.div>

                    {/* Last Name */}
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <label className="block mb-2 font-medium text-blue-800 text-sm">
                        Last Name
                      </label>
                      <div
                        className={`relative flex items-center overflow-hidden rounded-lg shadow-sm border ${
                          focusedField === "last_name"
                            ? "border-blue-500 shadow-md ring-2 ring-blue-100"
                            : "border-blue-100"
                        } transition-all duration-200 bg-white hover:border-blue-200`}
                      >
                        <div className="flex items-center justify-center h-full px-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          onFocus={() => handleFocus("last_name")}
                          onBlur={handleBlur}
                          className="w-full px-4 py-3.5 bg-white/90 focus:outline-none"
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                      {fieldErrors.last_name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          {fieldErrors.last_name}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  {/* Email */}
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <label className="block mb-2 font-medium text-blue-800 text-sm">
                      Email{" "}
                      <span className="text-gray-500 text-xs">(read-only)</span>
                    </label>
                    <div
                      className={`relative flex items-center overflow-hidden rounded-lg shadow-sm border ${
                        focusedField === "email"
                          ? "border-blue-500 shadow-md ring-2 ring-blue-100"
                          : "border-blue-100"
                      } transition-all duration-200 bg-gray-50`}
                    >
                      <div className="flex items-center justify-center h-full px-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <input
                        disabled={true}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus("email")}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3.5 bg-white/90 focus:outline-none text-gray-500"
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {fieldErrors.email}
                      </p>
                    )}
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.4 }}
                    className="relative"
                  >
                    <label className="block mb-2 font-medium text-blue-800 text-sm">
                      Phone Number
                    </label>
                    <div
                      className={`relative flex items-center overflow-hidden rounded-lg shadow-sm border ${
                        focusedField === "phone"
                          ? "border-blue-500 shadow-md ring-2 ring-blue-100"
                          : "border-blue-100"
                      } transition-all duration-200 bg-white hover:border-blue-200`}
                    >
                      <div className="flex items-center justify-center h-full px-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => handleFocus("phone")}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3.5 bg-white/90 focus:outline-none"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {fieldErrors.phone}
                      </p>
                    )}
                  </motion.div>

                  {/* Gender */}
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.5 }}
                    className="relative"
                  >
                    <label className="block mb-2 font-medium text-blue-800 text-sm">
                      Gender
                    </label>
                    <div
                      className={`relative flex items-center overflow-hidden rounded-lg shadow-sm border ${
                        focusedField === "gender"
                          ? "border-blue-500 shadow-md ring-2 ring-blue-100"
                          : "border-blue-100"
                      } transition-all duration-200 bg-white hover:border-blue-200`}
                    >
                      <div className="flex items-center justify-center h-full px-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        onFocus={() => handleFocus("gender")}
                        onBlur={handleBlur}
                        className="w-full px-4 py-3.5 bg-white/90 focus:outline-none appearance-none"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {fieldErrors.gender && (
                      <p className="text-red-500 text-xs mt-1 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {fieldErrors.gender}
                      </p>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.7 }}
                    className="pt-6"
                  >
                    <motion.button
                      whileHover={{ scale: isFormChanged() ? 1.02 : 1 }}
                      whileTap={{ scale: isFormChanged() ? 0.98 : 1 }}
                      type="submit"
                      disabled={!isFormChanged()}
                      className={`px-8 py-3.5 rounded-lg font-medium transition-all duration-300 shadow-md w-full md:w-auto ${
                        isFormChanged()
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 hover:shadow-lg"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <span className="flex items-center justify-center">
                        {isFormChanged() ? (
                          <>
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
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Save Changes
                          </>
                        ) : (
                          "No Changes to Save"
                        )}
                      </span>
                    </motion.button>
                  </motion.div>
                </form>
              </div>

              {/* Password Reset Section moved to right column */}
              <div className="xl:col-span-1">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-blue-50 rounded-lg border border-blue-100 p-5 shadow-sm"
                >
                  <h3 className="text-blue-800 font-medium mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    Password Management
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Need to change your password? Click the button below.
                  </p>
                  <button
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {resetLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
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
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Reset Password
                      </>
                    )}
                  </button>
                  {forgotMessage && (
                    <p className="text-sm text-green-600 mt-2 bg-green-50 p-2 rounded border border-green-100">
                      {forgotMessage}
                    </p>
                  )}
                  {forgotError && (
                    <p className="text-sm text-red-600 mt-2 bg-red-50 p-2 rounded border border-red-100">
                      {forgotError}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
