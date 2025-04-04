"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      Swal.fire({
        text: "Thank you for contacting us! We will get back to you soon.",
        timer: 2000,
        showConfirmButton: false,
        width: "300px",
        position: "center",
        background: "#f0f9ff",
        iconColor: "#014DAE",
        customClass: {
          popup: "rounded-lg shadow-md",
          title: "text-2xl font-sans font-semibold text-blue-700",
        },
      });
      setFormData({ name: "", email: "", message: "" }); // Optionally reset form
    } catch (error) {
      console.error("Error sending contact message:", error);
      Swal.fire({
        text: "There was an error sending your message. Please try again later.",
        confirmButtonText: "OK",
        timer: 3000,
        showConfirmButton: false,
        position: "top",
        width: "300px",
        background: "#fee2e2",
        iconColor: "#dc2626",
        customClass: {
          popup: "rounded-lg shadow-md",
          title: "text-2xl font-sans font-semibold text-red-700",
          htmlContainer: "font-sans text-gray-700",
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/50 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-lg border border-gray-200"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-extrabold text-center text-gray-800"
      >
        Contact Us
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 mt-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Name
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Message
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.02 }}
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Message
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
