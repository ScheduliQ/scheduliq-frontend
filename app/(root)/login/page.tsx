"use client";
import Image from "next/image";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../config/firebase"; // Adjust path based on your setup
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
      alert("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      setLoginError(err.message || "An unexpected error occurred.");
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
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <Image
        src="/logo.png"
        alt="logo"
        width={450}
        height={250}
        className="pb-14 ml-4"
      />
      <h1 className="text-2xl font-bold mb-4 text-black">Login</h1>

      {/* Forgot Password Button */}
      <button
        className="text-blue-500 underline text-sm mb-4"
        onClick={() => setShowModal(true)}
      >
        Forgot Password?
      </button>

      {loginError && <p className="text-red-500 mb-4">{loginError}</p>}
      <form
        className="flex flex-col space-y-4 w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <input
          type="email"
          placeholder="Email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          className="px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          className="px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className={`px-6 py-3 text-white rounded-md font-bold ${
            loginLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loginLoading}
        >
          {loginLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Forgot Password Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Forgot Password</h3>
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
                className="input input-bordered w-full mb-4"
                required
              />
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  forgotLoading ? "loading" : ""
                }`}
                disabled={forgotLoading}
              >
                {forgotLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="modal-action">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-ghost"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
