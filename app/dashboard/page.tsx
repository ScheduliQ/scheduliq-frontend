"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSessionGuard from "../../hooks/useSessionGuard"; // Your custom hook for session handling
import Loading from "../components/Loading";

export default function NavigationDashboard() {
  const user = useSessionGuard(); // Fetch authenticated user and their role
  const router = useRouter();

  useEffect(() => {
    if (!user) return; // Wait for session to load
    const role = user?.role; // Retrieve role from user object
    // alert(`hey2------${role}`);
    if (role === "manager") {
      router.push("/dashboard/manager"); // Redirect to Manager Dashboard
    } else if (role === "worker") {
      router.push("/dashboard/worker"); // Redirect to Worker Dashboard
    } else {
      router.push("/login"); // Redirect to login if role is undefined
    }
  }, [user, router]);

  return <Loading />;
}
