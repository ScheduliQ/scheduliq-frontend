"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../config/firebase"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth";

const useSessionGuard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const idTokenResult = await currentUser.getIdTokenResult(true);
          const role = idTokenResult.claims.role;
          setUser({
            ...currentUser,
            role, // Attach role to user object
          });
        } catch (error) {
          console.error("Error fetching user token:", error);
          router.push("/login");
        }
        // alert(`hey------${currentUser}`);
        // setUser(currentUser); // Save the user info
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [router]);

  return user;
};

export default useSessionGuard;
