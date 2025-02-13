"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "../../../hooks/RoleContext"; // adjust path if needed

export default function SettingsPage() {
  const { uid } = useRole();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    jobs: "",
    business_id: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    if (!uid) {
      setError("User not found.");
      setLoading(false);
      return;
    }
    const fetchUserData = async () => {
      try {
        // Assuming you have a GET route to fetch user data
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/userdata/${uid}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch user details.");
        }
        const data = await res.json();
        setUserDetails(data);
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          jobs: data.jobs,
          business_id: data.business_id,
        });
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
  };

  // Submit the updated settings to the backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uid) {
      setError("User not found.");
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
      setMessage("Settings updated successfully!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label className="block mb-1 font-medium">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        {/* Last Name */}
        <div>
          <label className="block mb-1 font-medium">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        {/* Phone */}
        <div>
          <label className="block mb-1 font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        {/* Gender */}
        <div>
          <label className="block mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Jobs */}
        <div>
          <label className="block mb-1 font-medium">Jobs</label>
          <input
            type="text"
            name="jobs"
            value={formData.jobs}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        {/* Business */}
        <div>
          <label className="block mb-1 font-medium">Business</label>
          <input
            type="text"
            name="business_id"
            value={formData.business_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        {/* Date of Joining (read-only) */}
        <div>
          <label className="block mb-1 font-medium">Date of Joining</label>
          <input
            type="text"
            value={new Date(userDetails.created_at).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}
            readOnly
            className="w-full border rounded p-2 bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Settings
        </button>
      </form>
    </div>
  );
}
