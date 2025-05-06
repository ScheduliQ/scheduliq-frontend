"use client";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import DynamicBackground from "../../components/DynamicBackground";

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("");

  // Function to handle intersection observer for scroll spy
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const scrollToSection = (sectionId: any) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
      <DynamicBackground />

      {/* Main Content */}
      <main className="flex-1">
        {/* Header Section - More formal and professional */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 py-10">
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 600"
            >
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 0 10 L 40 10 M 10 0 L 10 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="container mx-auto px-6 relative">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block text-sm font-medium text-blue-100 mb-1"
                >
                  Last Updated: February 2025
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight"
                >
                  Privacy Policy
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-3 md:mt-0 hidden md:block"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-200 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-white">
                    Official Documentation
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mt-4"></div>
          </div>
        </div>

        {/* Introduction section - formal and professional */}
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-8 mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
              <div className="mb-6 md:mb-0 md:w-1/4">
                <div className="p-3 bg-blue-50 rounded-lg inline-flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>

              <div className="md:w-3/4">
                <h2 className="text-blue-800 text-lg font-semibold mb-4">
                  ScheduliQ Privacy Framework
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  This Privacy Policy outlines the types of information
                  collected by ScheduliQ, how this information is used, and the
                  measures taken to protect your data. At ScheduliQ, we are
                  committed to maintaining the highest standards of data privacy
                  and security in accordance with data protection regulations.
                  This document provides an overview of our data handling
                  practices for our shift scheduling system.
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="bg-white rounded-lg shadow-sm border border-blue-100 p-6 mb-10 sticky top-4 z-10">
            <h3 className="text-blue-800 font-medium mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
              Quick Navigation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <button
                onClick={() => scrollToSection("information-collection")}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-blue-50 
                  ${
                    activeSection === "information-collection"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-slate-600"
                  }`}
              >
                Information Collection
              </button>
              <button
                onClick={() => scrollToSection("data-usage")}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-blue-50 
                  ${
                    activeSection === "data-usage"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-slate-600"
                  }`}
              >
                How We Use Your Data
              </button>
              <button
                onClick={() => scrollToSection("data-security")}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-blue-50 
                  ${
                    activeSection === "data-security"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-slate-600"
                  }`}
              >
                Data Security
              </button>
              <button
                onClick={() => scrollToSection("your-rights")}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-blue-50 
                  ${
                    activeSection === "your-rights"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-slate-600"
                  }`}
              >
                Your Rights
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-blue-50 
                  ${
                    activeSection === "contact"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-slate-600"
                  }`}
              >
                Contact Support
              </button>
            </div>
          </div>

          {/* Rest of content will be added in the next edit */}
          <div className="space-y-8">
            {/* Information Collection Section */}
            <section
              id="information-collection"
              className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden"
            >
              <div className="border-b border-blue-50">
                <h2 className="text-xl font-medium text-blue-800 p-6">
                  Information Collection
                </h2>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  ScheduliQ collects the following types of information to
                  provide our shift scheduling service:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-blue-100 rounded-lg p-5">
                    <div className="flex items-center mb-4">
                      <span className="bg-blue-50 p-2 rounded mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
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
                      </span>
                      <h3 className="font-medium text-blue-800">
                        User Information
                      </h3>
                    </div>
                    <ul className="space-y-3 text-slate-600 text-sm pl-4">
                      <li className="flex items-baseline">
                        <span className="bg-blue-200 w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        <span>
                          <strong>Name and Email:</strong> For account
                          identification and notifications
                        </span>
                      </li>
                      <li className="flex items-baseline">
                        <span className="bg-blue-200 w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        <span>
                          <strong>Role:</strong> Manager or worker status for
                          system permissions
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="border border-blue-100 rounded-lg p-5">
                    <div className="flex items-center mb-4">
                      <span className="bg-blue-50 p-2 rounded mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                      <h3 className="font-medium text-blue-800">
                        Scheduling Data
                      </h3>
                    </div>
                    <ul className="space-y-3 text-slate-600 text-sm pl-4">
                      <li className="flex items-baseline">
                        <span className="bg-blue-200 w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        <span>
                          <strong>Availability:</strong> Your schedule
                          preferences and availability times
                        </span>
                      </li>
                      <li className="flex items-baseline">
                        <span className="bg-blue-200 w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        <span>
                          <strong>Shift Records:</strong> Historical and
                          upcoming shift information
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-6 border-l-4 border-blue-400">
                  <div className="flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm text-slate-700">
                      <span className="font-medium">Note:</span> ScheduliQ
                      collects only essential information needed to provide our
                      scheduling service. We do not sell personal information to
                      third parties.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Usage Section */}
            <section
              id="data-usage"
              className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden"
            >
              <div className="border-b border-blue-50">
                <h2 className="text-xl font-medium text-blue-800 p-6">
                  How We Use Your Information
                </h2>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  ScheduliQ uses your information for the following purposes:
                </p>

                <div className="grid md:grid-cols-3 gap-5">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-lg p-5"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-blue-100 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-blue-800 mb-2">
                      Shift Management
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Creating and maintaining shift schedules for both managers
                      and workers based on availability.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-lg p-5"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-blue-100 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-blue-800 mb-2">
                      Notifications
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Sending alerts about schedule changes, new shifts, and
                      other important updates.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-lg p-5"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-blue-100 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-blue-800 mb-2">
                      Reporting
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Generating reports for managers to analyze scheduling
                      patterns and optimize workforce management.
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Data Security Section */}
            <section
              id="data-security"
              className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden"
            >
              <div className="border-b border-blue-50">
                <h2 className="text-xl font-medium text-blue-800 p-6">
                  Data Security
                </h2>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  We take the security of your data seriously. ScheduliQ
                  implements various measures to ensure your information remains
                  protected:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-blue-50 border border-blue-100 rounded-lg p-5"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                          Secure Authentication
                        </p>
                        <p className="text-sm text-slate-600">
                          User access is protected by secure authentication
                          methods.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-blue-50 border border-blue-100 rounded-lg p-5"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                          Data Encryption
                        </p>
                        <p className="text-sm text-slate-600">
                          Your information is encrypted when transmitted and
                          stored.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-blue-50 border border-blue-100 rounded-lg p-5"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                          Access Controls
                        </p>
                        <p className="text-sm text-slate-600">
                          Strict role-based permission systems limit data access
                          appropriately.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="bg-blue-50 border border-blue-100 rounded-lg p-5"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-800">
                          Regular Updates
                        </p>
                        <p className="text-sm text-slate-600">
                          Our system is regularly updated to address security
                          vulnerabilities.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Your Rights Section */}
            <section
              id="your-rights"
              className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden"
            >
              <div className="border-b border-blue-50">
                <h2 className="text-xl font-medium text-blue-800 p-6">
                  Your Rights
                </h2>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  As a user of ScheduliQ, you have certain rights regarding your
                  personal information:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                    className="bg-blue-50 border border-blue-100 rounded-lg p-5"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded text-blue-600 mr-3">
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
                            strokeWidth={1.5}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">
                          View Your Data
                        </h4>
                        <p className="text-sm text-slate-600">
                          You can view your profile information and scheduling
                          data from your account dashboard.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-blue-50 border border-blue-100 rounded-lg p-5"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded text-blue-600 mr-3">
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
                            strokeWidth={1.5}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">
                          Update Your Information
                        </h4>
                        <p className="text-sm text-slate-600">
                          You can update your profile information and
                          availability preferences through your user settings.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-blue-50 border border-blue-100 rounded-lg p-5 md:col-span-2"
                  >
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded text-blue-600 mr-3">
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
                            strokeWidth={1.5}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">
                          Contact Us
                        </h4>
                        <p className="text-sm text-slate-600">
                          For any questions about your data or to request
                          changes not available through the user interface,
                          please{" "}
                          <Link
                            href="/dashboard/contact"
                            className="text-blue-600 hover:underline"
                          >
                            contact us
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section
              id="contact"
              className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-4 text-white/80"
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
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Need Support?
                  </h3>
                  <p className="text-white/90 max-w-xl mx-auto mb-6">
                    If you have any questions about this privacy policy or how
                    ScheduliQ handles your information, please reach out to our
                    support team.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/dashboard/contact"
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors shadow-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Contact Us
                  </Link>
                </motion.div>

                <div className="mt-8 pt-6 border-t border-blue-400/30">
                  <p className="text-white/70 text-sm">
                    © {new Date().getFullYear()} ScheduliQ. All rights reserved.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
