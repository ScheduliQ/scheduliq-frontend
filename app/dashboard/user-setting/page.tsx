"use client";

import React, { useState, useEffect } from "react";
import { useRole } from "../../../hooks/RoleContext"; // adjust path if needed
import Swal from "sweetalert2";

export default function SettingsPage() {
  const { uid } = useRole();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
  });
  const [initialFormData, setInitialFormData] = useState<any>(null);
  // הודעות שגיאה עבור ולידציות פרטניות
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [error, setError] = useState<string | null>(null); // שגיאות כלליות (למשל מהשרת)
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
        };
        setFormData(initialData);
        setInitialFormData(initialData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  // Handle form field changes - מנקה הודעת שגיאה עבור אותו שדה
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  // בדיקה האם הנתונים השתנו ביחס למקוריים
  const isFormChanged = () => {
    if (!initialFormData) return false;
    return (
      formData.first_name !== initialFormData.first_name ||
      formData.last_name !== initialFormData.last_name ||
      formData.email !== initialFormData.email ||
      formData.phone !== initialFormData.phone ||
      formData.gender !== initialFormData.gender
    );
  };

  // פונקציה לוולידציות של השדות, מציבה הודעות שגיאה תחת כל שדה במידת הצורך
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
    // Gender - אם שדה נבחר, צריך להיות אחד מהאפשרויות
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
    // הפעלת הוולידציות לפני השליחה
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
      };
      setInitialFormData(updatedInitialData);
      setMessage("Settings updated successfully!");
      Swal.fire({
        title: "Settings updated successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
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

  if (loading) return <div className="p-4">Loading...</div>;
  // הודעת שגיאה כללית (למשל מטעינת נתונים או מהשרת) תוצג בנפרד
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto max-h-[500px] overflow-y-auto">
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
          {fieldErrors.first_name && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.first_name}
            </p>
          )}
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
          {fieldErrors.last_name && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.last_name}</p>
          )}
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
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
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
          {fieldErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
          )}
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
          {fieldErrors.gender && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.gender}</p>
          )}
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
          disabled={!isFormChanged()}
          className={`px-4 py-2 rounded ${
            isFormChanged()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-400 text-gray-800 cursor-not-allowed"
          }`}
        >
          Update Settings
        </button>
      </form>
    </div>
  );
}
