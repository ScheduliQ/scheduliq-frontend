"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShowSwalAlert } from "@/app/dashboard/components/ShowSwalAlert";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      ShowSwalAlert(
        "success",
        "Thank you for contacting us! We will get back to you soon."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending contact message:", error);
      ShowSwalAlert(
        "error",
        "There was an error sending your message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const formControls = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          variants={formControls}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-blue-800 mb-1.5">
            Full Name
          </label>
          <div
            className={`relative flex items-center overflow-hidden rounded-lg border ${
              focusedField === "name"
                ? "border-blue-500 ring-2 ring-blue-100"
                : "border-blue-100"
            } transition-all duration-200`}
          >
            <div className="flex items-center justify-center h-full px-3 bg-blue-50">
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
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 bg-white/90 focus:outline-none"
              placeholder="Enter your name"
              required
            />
          </div>
        </motion.div>

        <motion.div
          variants={formControls}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-blue-800 mb-1.5">
            Email Address
          </label>
          <div
            className={`relative flex items-center overflow-hidden rounded-lg border ${
              focusedField === "email"
                ? "border-blue-500 ring-2 ring-blue-100"
                : "border-blue-100"
            } transition-all duration-200`}
          >
            <div className="flex items-center justify-center h-full px-3 bg-blue-50">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
              className="w-full px-4 py-3 bg-white/90 focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={formControls}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <label className="block text-sm font-medium text-blue-800 mb-1.5">
          Subject
        </label>
        <div
          className={`relative flex items-center overflow-hidden rounded-lg border ${
            focusedField === "subject"
              ? "border-blue-500 ring-2 ring-blue-100"
              : "border-blue-100"
          } transition-all duration-200`}
        >
          <div className="flex items-center justify-center h-full px-3 bg-blue-50">
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
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
              />
            </svg>
          </div>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onFocus={() => handleFocus("subject")}
            onBlur={handleBlur}
            className="w-full px-4 py-3 bg-white/90 focus:outline-none appearance-none"
            required
          >
            <option value="" disabled>
              Select an option
            </option>
            <option value="General Inquiry">General Inquiry</option>
            <option value="Technical Support">Technical Support</option>
            <option value="Feedback">Feedback</option>
            <option value="Billing Question">Billing Question</option>
            <option value="Feature Request">Feature Request</option>
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
      </motion.div>

      <motion.div
        variants={formControls}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4 }}
        className="relative"
      >
        <label className="block text-sm font-medium text-blue-800 mb-1.5">
          Message
        </label>
        <div
          className={`relative flex overflow-hidden rounded-lg border ${
            focusedField === "message"
              ? "border-blue-500 ring-2 ring-blue-100"
              : "border-blue-100"
          } transition-all duration-200`}
        >
          <div className="flex items-start justify-center h-10 px-3 mt-2 bg-blue-50">
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            onFocus={() => handleFocus("message")}
            onBlur={handleBlur}
            className="w-full px-4 py-3 bg-white/90 focus:outline-none"
            placeholder="Your message here..."
            rows={6}
            required
          />
        </div>
      </motion.div>

      <motion.div
        variants={formControls}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.5 }}
        className="pt-2"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-lg font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ${
            isSubmitting
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
          }`}
        >
          <span className="flex items-center justify-center">
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Send Message
              </>
            )}
          </span>
        </motion.button>
      </motion.div>

      <motion.p
        variants={formControls}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-slate-500 mt-4"
      >
        By submitting this form, you agree to our{" "}
        <a href="/dashboard/terms" className="text-blue-600 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/dashboard/privacy-policy"
          className="text-blue-600 hover:underline"
        >
          Privacy Policy
        </a>
        .
      </motion.p>
    </motion.form>
  );
}
