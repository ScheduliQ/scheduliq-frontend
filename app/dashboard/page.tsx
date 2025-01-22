"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSessionGuard from "../../hooks/useSessionGuard"; // Your custom hook for session handling
import Loading from "../components/Loading";
import { useRole } from "../../hooks/RoleContext"; // ייבוא ה-Context

export default function NavigationDashboard() {
  const { user, isLoading } = useSessionGuard(); // Fetch authenticated user and their role
  const router = useRouter();
  const { setRole } = useRole(); // קריאת ה-Context ועדכון הפונקציה setRole

  useEffect(() => {
    if (!user) return; // Wait for session to load
    const role = user?.role; // Retrieve role from user object
    setRole(role); // עדכון ה-Context עם ה-Role

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
