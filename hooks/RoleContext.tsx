"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import useSessionGuard from "./useSessionGuard";

interface RoleContextType {
  role: string | null;
  uid: string | null;
  isLoading: boolean;
  setRole: (role: string | null) => void;
  setUid: (uid: string | null) => void;
}

// יצירת הקונטקסט עבור המידע על הרול
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// הקומפוננטה המספקת את הקונטקסט, שמאפשרת לעטוף חלקים באפליקציה שבהם ניתן לגשת למידע על הרול
export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading: sessionLoading } = useSessionGuard();
  const [role, setRoleState] = useState<string | null>(null);
  const [uid, setUidState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // מצב טעינה ל-Context

  // טעינת UID ו-Role לסטייט
  useEffect(() => {
    if (!sessionLoading) {
      if (user) {
        setUidState(user.uid || null);
      } else {
        setUidState(null);
      }
      setIsLoading(false); // הטעינה הושלמה
    }
  }, [user, sessionLoading]);

  const setRole = (newRole: string | null) => {
    setRoleState(newRole); // עדכון המצב הפנימי
    if (newRole) {
      localStorage.setItem("userRole", newRole);
    } else {
      localStorage.removeItem("userRole");
    }
  };
  const setUid = (newUid: string | null) => {
    setUidState(newUid);
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setRoleState(storedRole); // עדכון המצב עם הרול מה-localStorage
    }
  }, []);

  return (
    <RoleContext.Provider value={{ role, uid, isLoading, setRole, setUid }}>
      {children}
    </RoleContext.Provider>
  );
};

// הוק מותאם אישית לשימוש בקונטקסט של הרול
export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};
