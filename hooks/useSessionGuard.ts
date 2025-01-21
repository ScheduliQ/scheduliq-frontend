"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../config/firebase"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";

const useSessionGuard = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idTokenResult = await currentUser.getIdTokenResult(true);
          const role = idTokenResult.claims.role; // אם יש צורך בתפקידים
          setUser({
            ...currentUser,
            role, // שמירת תפקיד אם נדרש
          });
        } catch (error) {
          console.error("Error fetching user token:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false); // טעינה הסתיימה
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return { user, isLoading };
};

export default useSessionGuard;
