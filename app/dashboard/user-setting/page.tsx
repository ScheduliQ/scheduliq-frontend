"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRole } from "../../../hooks/RoleContext"; // adjust path if needed
import Swal from "sweetalert2";
import Image from "next/image";

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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      Swal.fire({
        title: "Settings updated successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        willClose: () => {
          // Refresh the page after the alert closes
          window.location.reload();
        },
      });
    } catch (err: any) {
      setError(err.message);
      Swal.fire({
        title: err.message,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  // Default profile image if none exists
  const getDefaultProfileImage = () => {
    return `https://ui-avatars.com/api/?name=${formData.first_name}+${formData.last_name}&background=random&color=fff&size=256`;
  };

  // Replace the existing error conditional render with this
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  // Only show the error message box for backend errors, not for missing uid
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
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {!uid && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-600">Loading user information...</p>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Account Settings
      </h1>

      {message && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {message}
        </div>
      )}

      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center">
          <div className="relative mb-4 group">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200">
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
              className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
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
          </div>

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
            <p className="font-medium text-lg">
              {formData.first_name} {formData.last_name}
            </p>
            <p className="text-gray-500">
              Member since{" "}
              {userDetails &&
                new Date(userDetails.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              {fieldErrors.first_name && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.first_name}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              {fieldErrors.last_name && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.last_name}
                </p>
              )}
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Phone
            </label>
            <div className="relative">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {fieldErrors.gender && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.gender}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={!isFormChanged()}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isFormChanged()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {isFormChanged() ? "Save Changes" : "No Changes to Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
