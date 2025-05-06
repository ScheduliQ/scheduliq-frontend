"use client";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import DynamicBackground from "../../components/DynamicBackground";

export default function TermsPage() {
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

  const scrollToSection = (sectionId: string) => {
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
                  Terms of Service
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm text-white">Legal Document</span>
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
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                </div>
              </div>

              <div className="md:w-3/4">
                <h2 className="text-blue-800 text-lg font-semibold mb-4">
                  ScheduliQ Terms Framework
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  These Terms of Service outline the rules and regulations for
                  using ScheduliQ's shift scheduling system. By accessing or
                  using our platform, you agree to be bound by these terms. This
                  document governs your relationship with ScheduliQ and
                  establishes both your rights and responsibilities as a user of
                  our system.
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <button
                onClick={() => scrollToSection("introduction")}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-blue-50 
                  ${
                    activeSection === "introduction"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-slate-600"
                  }`}
              >
                Introduction
              </button>
              <button
                onClick={() => scrollToSection("user-responsibilities")}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-blue-50 
                  ${
                    activeSection === "user-responsibilities"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-slate-600"
                  }`}
              >
                User Responsibilities
              </button>
              <button
                onClick={() => scrollToSection("account-security")}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-blue-50 
                  ${
                    activeSection === "account-security"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-slate-600"
                  }`}
              >
                Account Security
              </button>
              <button
                onClick={() => scrollToSection("prohibited-activities")}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-blue-50 
                  ${
                    activeSection === "prohibited-activities"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-slate-600"
                  }`}
              >
                Prohibited Activities
              </button>
              <button
                onClick={() => scrollToSection("service-availability")}
                className={`text-left px-3 py-2 rounded-md text-sm transition-colors hover:bg-blue-50 
                  ${
                    activeSection === "service-availability"
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-slate-600"
                  }`}
              >
                Service Availability
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
                Contact Us
              </button>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Introduction Section */}
            <section
              id="introduction"
              className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden"
            >
              <div className="border-b border-blue-50">
                <h2 className="text-xl font-medium text-blue-800 p-6">
                  1. Introduction
                </h2>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Welcome to{" "}
                  <span className="text-blue-700 font-semibold">ScheduliQ</span>
                  ! By accessing or using our services, you agree to these Terms
                  of Service which constitute a legally binding agreement.
                </p>

                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
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
                      <span className="font-medium">Note:</span> These terms may
                      be updated from time to time. It is your responsibility to
                      review them periodically.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* User Responsibilities Section */}
            <section
              id="user-responsibilities"
              className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden"
            >
              <div className="border-b border-blue-50">
                <h2 className="text-xl font-medium text-blue-800 p-6">
                  2. User Responsibilities
                </h2>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  As a user of ScheduliQ, you are responsible for:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="border border-blue-100 rounded-lg p-5"
                  >
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
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </span>
                      <h3 className="font-medium text-blue-800">
                        Content Integrity
                      </h3>
                    </div>
                    <ul className="space-y-3 text-slate-600 text-sm pl-4">
                      <li className="flex items-baseline">
                        <span className="bg-blue-200 w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        <span>Providing accurate and truthful information</span>
                      </li>
                      <li className="flex items-baseline">
                        <span className="bg-blue-200 w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        <span>
                          Maintaining the accuracy of your account information
                        </span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="border border-blue-100 rounded-lg p-5"
                  >
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </span>
                      <h3 className="font-medium text-blue-800">
                        Appropriate Conduct
                      </h3>
                    </div>
                    <ul className="space-y-3 text-slate-600 text-sm pl-4">
                      <li className="flex items-baseline">
                        <span className="bg-blue-200 w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        <span>Using the platform only for lawful purposes</span>
                      </li>
                      <li className="flex items-baseline">
                        <span className="bg-blue-200 w-1.5 h-1.5 rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                        <span>
                          Respecting the privacy and rights of other users
                        </span>
                      </li>
                    </ul>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Account Security Section */}
            <section
              id="account-security"
              className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden"
            >
              <div className="border-b border-blue-50">
                <h2 className="text-xl font-medium text-blue-800 p-6">
                  3. Account Security
                </h2>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  Maintaining the security of your account is critical for the
                  protection of your data and the system's integrity:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
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
                          Keep Credentials Private
                        </p>
                        <p className="text-sm text-slate-600">
                          Never share your login credentials with anyone else,
                          including coworkers.
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
                          Strong Passwords
                        </p>
                        <p className="text-sm text-slate-600">
                          Use strong, unique passwords and enable two-factor
                          authentication when available.
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
                          Report Suspicious Activity
                        </p>
                        <p className="text-sm text-slate-600">
                          Report any unauthorized access or suspicious activity
                          immediately.
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
                          Secure Your Devices
                        </p>
                        <p className="text-sm text-slate-600">
                          Log out from shared devices and keep your own devices
                          secure.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Prohibited Activities Section */}
            <section
              id="prohibited-activities"
              className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden"
            >
              <div className="border-b border-blue-50">
                <h2 className="text-xl font-medium text-blue-800 p-6">
                  4. Prohibited Activities
                </h2>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  To maintain the integrity of our platform, the following
                  activities are strictly prohibited:
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-blue-800 mb-2">
                      Security Violations
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Hacking, attempting to breach our security, or using
                      vulnerabilities in the system.
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
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-blue-800 mb-2">
                      Automated Access
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Using robots, scrapers, or other automated tools to access
                      or collect data from our platform.
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
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                        />
                      </svg>
                    </div>
                    <h3 className="font-medium text-blue-800 mb-2">
                      Service Disruption
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Actions that disrupt, interfere with, or negatively affect
                      the functionality of our services.
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Service Availability Section */}
            <section
              id="service-availability"
              className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden"
            >
              <div className="border-b border-blue-50">
                <h2 className="text-xl font-medium text-blue-800 p-6">
                  5. Service Availability
                </h2>
              </div>

              <div className="p-6">
                <p className="text-slate-600 mb-6">
                  While we strive to provide uninterrupted service, please
                  understand:
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">
                          Maintenance Windows
                        </h4>
                        <p className="text-sm text-slate-600">
                          We may temporarily suspend access for maintenance,
                          updates, or improvements.
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
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800 mb-1">
                          Service Changes
                        </h4>
                        <p className="text-sm text-slate-600">
                          We reserve the right to modify, suspend, or
                          discontinue services with reasonable notice.
                        </p>
                      </div>
                    </div>
                  </motion.div>
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
                      <span className="font-medium">Important:</span> ScheduliQ
                      is not liable for any damages or losses resulting from
                      service interruptions. We recommend regularly exporting
                      important data as a precaution.
                    </p>
                  </div>
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
                    Questions About Our Terms?
                  </h3>
                  <p className="text-white/90 max-w-xl mx-auto mb-6">
                    If you have any questions about these Terms of Service or
                    need clarification about any part of our agreement, our
                    support team is here to help.
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
