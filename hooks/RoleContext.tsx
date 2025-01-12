"use client"; // הפעלת המצב 'client' עבור Next.js
import React, { createContext, useContext, useState, useEffect } from "react"; // ייבוא פונקציות React ליצירת קונטקסט ושימוש בו

// הגדרת הממשק שמכיל את המידע על הרול (role) והפונקציה לעדכונו (setRole)
interface RoleContextType {
  role: string | null; // המידע על הרול, יכול להיות מחרוזת או null
  setRole: (role: string | null) => void; // פונקציה לעדכון הרול
}

// יצירת הקונטקסט עבור המידע על הרול
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// הקומפוננטה המספקת את הקונטקסט, שמאפשרת לעטוף חלקים באפליקציה שבהם ניתן לגשת למידע על הרול
export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // מצב עבור הרול, כולל טעינה מה-localStorage אם קיים
  const [role, setRoleState] = useState<string | null>(null);

  // פונקציה לעדכון הרול שמעדכנת גם את ה-localStorage
  const setRole = (newRole: string | null) => {
    setRoleState(newRole); // עדכון המצב הפנימי
    if (newRole) {
      localStorage.setItem("userRole", newRole); // שמירה ב-localStorage
    } else {
      localStorage.removeItem("userRole"); // מחיקה אם אין רול
    }
  };

  // טעינת הרול מ-localStorage פעם אחת כשנטען ה-Provider
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setRoleState(storedRole); // עדכון המצב עם הרול מה-localStorage
    }
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
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
