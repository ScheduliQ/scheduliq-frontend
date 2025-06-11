"use client";
import ContactForm from "../../components/ContactForm";
import Footer from "../components/Footer";
import DynamicBackground from "../../components/DynamicBackground";
import { motion } from "framer-motion";

export default function ContactPage() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
      <DynamicBackground />

      {/* Main Content */}
      <main className="flex-1">
        {/* Header Section */}
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
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight"
                >
                  Contact Us
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-blue-100 mt-1 max-w-md text-sm"
                >
                  Our team is here to help with any questions or concerns you
                  may have about ScheduliQ.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-white">
                    Typical response time:{" "}
                    <span className="font-medium">Within 24 hours</span>
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent mt-4"></div>
          </div>
        </div>

        {/* Form Section */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-5xl mx-auto">
            {/* Benefits Bar */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
            >
              <motion.div
                variants={fadeInUp}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-blue-50 flex items-center"
              >
                <div className="bg-blue-500/10 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">Quick Response</h3>
                  <p className="text-sm text-slate-600">
                    We respond within 24 hours
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-blue-50 flex items-center"
              >
                <div className="bg-blue-500/10 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">
                    Dedicated Support
                  </h3>
                  <p className="text-sm text-slate-600">
                    Expert team ready to help
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-blue-50 flex items-center"
              >
                <div className="bg-blue-500/10 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">
                    Secure Communication
                  </h3>
                  <p className="text-sm text-slate-600">
                    Your data is always protected
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Main Content Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-blue-100 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Contact Info Section */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8">
                  <h3 className="text-xl font-semibold mb-6">
                    Contact Information
                  </h3>
                  <p className="mb-8 text-blue-100">
                    Feel free to reach out to us through any of these channels.
                    We're here to help make your scheduling experience better.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-blue-500/30 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
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
                        <p className="text-sm font-medium text-white">Email</p>
                        <a
                          href="mailto:support@scheduliq.com"
                          className="text-sm text-blue-100 hover:text-white transition-colors"
                        >
                          support@scheduliq.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-500/30 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
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
                      <div>
                        <p className="text-sm font-medium text-white">Phone</p>
                        <p className="text-sm text-blue-100">050-1234567</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-blue-500/30 p-2 rounded-full mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          Office Location
                        </p>
                        <p className="text-sm text-blue-100">
                          SCE
                          <br />
                          Ashdod, Israel
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-6 border-t border-blue-500/30">
                    <p className="text-sm text-blue-100">
                      Follow us on social media
                    </p>
                    <div className="flex space-x-4 mt-3">
                      <a
                        href="#"
                        className="bg-blue-500/30 p-2 rounded-full hover:bg-blue-500/50 transition-colors"
                      >
                        <svg
                          className="h-5 w-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="bg-blue-500/30 p-2 rounded-full hover:bg-blue-500/50 transition-colors"
                      >
                        <svg
                          className="h-5 w-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="bg-blue-500/30 p-2 rounded-full hover:bg-blue-500/50 transition-colors"
                      >
                        <svg
                          className="h-5 w-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Form Section */}
                <div className="col-span-2 p-8">
                  <h3 className="text-xl font-semibold text-blue-800 mb-6">
                    Send us a message
                  </h3>
                  <ContactForm />
                </div>
              </div>
            </motion.div>
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
