"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSessionGuard from "../../hooks/useSessionGuard";
import Loading from "./Loading";
interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading } = useSessionGuard(); // שימוש ב-useSessionGuard
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      // console.log("user", user);
      if (!isLoading) {
        if (!user) {
          router.push("/login"); // הפניה לעמוד התחברות
        } else {
          setIsSessionLoaded(true); // אישור שהסשן הושלם
        }
      }
    };

    checkSession();
  }, [isLoading, user, router]);

  if (isLoading || !isSessionLoaded) {
    return <Loading />; // מסך טעינה אם המידע עדיין לא נטען
  }

  return <>{children}</>; // רינדור התוכן המוגן
}
