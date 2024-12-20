"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../config/firebase"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";

const useSessionGuard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Save the user info
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [router]);

  return user;
};
//test
export default useSessionGuard;
