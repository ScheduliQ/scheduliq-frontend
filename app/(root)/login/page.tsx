"use client";
import Image from "next/image";
import { useState } from "react";
import Loading from "../../components/Loading";
import SecondaryButton from "../../components/SecondaryButton";

import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../config/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  // State for the login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // State for the forgot password modal
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  // Login functionality
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      // alert("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      if (err.message === "Firebase: Error (auth/invalid-credential).")
        setLoginError("Email or Password incorrect!");
      else setLoginError(err.message || "An unexpected error occurred.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Forgot Password functionality
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage("");
    setForgotError("");

    try {
      // setForgotLoading(true);
      await sendPasswordResetEmail(auth, forgotEmail);
      setForgotMessage("Password reset link has been sent to your email.");
    } catch (err: any) {
      if (err.code === "auth/invalid-email") {
        setForgotError("Invalid email format. Please check your input.");
      } else if (err.code === "auth/user-not-found") {
        setForgotError(
          "This email is not registered. Please check your input or sign up."
        );
      } else {
        setForgotError(
          "Failed to send password reset email. Please try again later."
        );
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-none  px-4">
      {loginLoading && <Loading />}

      {/* Container for both sections */}
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-4xl">
        {/* Left Section - Image */}
        <div
          className="w-full lg:w-1/2 h-[300px] lg:h-[550px] flex items-center justify-center bg-cover bg-bottom rounded-l-lg shadow-lg"
          style={{ backgroundImage: "url('/leftside2.jpg')" }}
        >
          {/* Optional content inside the div */}
        </div>

        {/* Right Section - Login */}
        <div className="w-full lg:w-1/2 h-auto lg:h-[550px] flex flex-col items-center justify-center bg-white/8 backdrop-blur-md rounded-r-lg shadow-lg p-6">
          <Image
            src="/logo.png"
            alt="logo"
            width={200}
            height={100}
            className="mb-6"
          />
          {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
          <form
            className="flex flex-col space-y-4 w-full"
            onSubmit={handleLogin}
          >
            <div className="space-y-4 w-full">
              {/* Email Input */}
              <input
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#F3F6FA] border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:border-transparent"
                required
              />

              {/* Password Input */}
              <input
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#F3F6FA] border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:border-transparent"
                required
              />

              {/* Forgot Password Link */}
            </div>
            <button
              type="submit"
              className={`px-6 py-3 text-white rounded-md font-bold ${
                loginLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#014DAE] hover:bg-[#012F70]"
              }`}
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Sign in"}
            </button>
          </form>
          <div className="text-right">
            <button
              className="text-[#014DAE] underline text-sm"
              onClick={() => setShowModal(true)}
            >
              Forgot password?
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-[#F7FAFC]">
            <h3 className="text-[#666666] font-sans font-bold text-lg">
              Forgot Password
            </h3>
            {forgotMessage && (
              <p className="text-green-500 mt-2">{forgotMessage}</p>
            )}
            {forgotError && <p className="text-red-500 mt-2">{forgotError}</p>}

            <form onSubmit={handleForgotPassword} className="mt-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#F3F6FA] border border-gray-300 rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#014DAE] focus:border-transparent mb-4"
                required
              />
              <button
                type="submit"
                className={`btn border-none  text-white text-bold w-full bg-[#014DAE] hover:bg-[#012F70] ${
                  forgotLoading ? "loading" : ""
                }`}
                disabled={forgotLoading}
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="modal-action">
              <SecondaryButton
                label="Close"
                onClick={() => setShowModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
