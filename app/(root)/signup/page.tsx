"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/firebase"; // Adjust path based on your structure

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user; // שליפת המשתמש שנרשם

      // קבלת ה-ID Token מהמשתמש שנרשם
      const idToken = await user.getIdToken();

      // שליחת ה-ID Token והאימייל ל-Backend לצורך רישום במסד הנתונים
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`, // שליחת הטוקן ב-Header
          },
          body: JSON.stringify({
            email: user.email, // שליחת המייל לשרת
          }),
        }
      );

      // בדיקת התגובה מהשרת
      if (!response.ok) {
        throw new Error("Failed to register user in the database.");
      }

      alert("Signup successful and user registered in the database!");
      router.push("/login"); // הפניה לדף ההתחברות
    } catch (err: any) {
      setError(err.message); // טיפול בשגיאות
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Signup</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white font-bold rounded-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </main>
  );
}
