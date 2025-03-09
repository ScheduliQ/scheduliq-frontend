"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRole } from "../../../hooks/RoleContext";
// אם תרצה להמיר את ה־ID ל־ObjectId, ניתן לייבא מספריית bson (אבל לרוב זה מטופל בצד השרת)
// import { ObjectId } from "bson";

// ----------------------
// ממשקים
// ----------------------

// ממשק להודעת מנהל (כולל שדה _id לזיהוי ייחודי)
interface ManagerMessage {
  _id?: string;
  uid: string;
  business_id: string;
  text: string;
  created_at: string;
  last_updated?: string;
}

// ממשק לפרטי המנהל
interface ManagerInfo {
  uid: string;
  business_id: string;
  profile_picture: string;
  first_name: string;
  last_name: string;
}

// ----------------------
// הקומפוננטה הראשית
// ----------------------
export default function Sidebar() {
  // קבלת תפקיד המשתמש ו-UID מהקונטקסט
  const { role, uid } = useRole();

  // ערכי גיבוי (במידה managerInfo לא נטען)
  const defaultManagerUid = "defaultManagerUid";
  const defaultBusinessId = "defaultBusinessId";

  // State לניהול ההודעות, טקסט ההודעה, מצב הצגת תיבת הקלט ופרטי המנהל
  const [messages, setMessages] = useState<ManagerMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const defaultManagerInfo: ManagerInfo = {
    uid: "",
    business_id: "",
    profile_picture: "",
    first_name: "",
    last_name: "",
  };
  const [managerInfo, setManagerInfo] =
    useState<ManagerInfo>(defaultManagerInfo);

  // State לניהול מצב העריכה
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");

  // Ref לצורך גלילה אוטומטית לתחתית רשימת ההודעות
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // ----------------------
  // פונקציות עזר
  // ----------------------

  // גלילה אוטומטית לתחתית הרשימה
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // שליפת הודעות מהשרת (GET)
  const fetchMessages = () => {
    fetch(`${baseUrl}/manager-messages/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data: ManagerMessage[]) => {
        // נניח שההודעות מהשרת מגיעות מהחדש לישן – הופכים את הסדר להצגה מהישן לחדש
        setMessages(data.reverse());
        scrollToBottom();
      })
      .catch((err) => console.error("Error fetching messages:", err));
  };

  // ----------------------
  // קריאות useEffect
  // ----------------------

  // קריאה לשליפת ההודעות עם טעינת הקומפוננטה
  useEffect(() => {
    fetchMessages();
  }, []);

  // קריאה לשליפת פרטי המנהל כאשר UID זמין
  useEffect(() => {
    if (!uid) return;
    fetch(`${baseUrl}/user/userdata/${uid}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error fetching manager info");
        }
        return res.json();
      })
      .then((data: ManagerInfo) => {
        setManagerInfo(data);
      })
      .catch((err) => console.error("Error fetching manager info:", err));
  }, [uid]);

  // ----------------------
  // פעולות הודעה: יצירה, עריכה, מחיקה
  // ----------------------

  // יצירת הודעה חדשה (POST)
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // שימוש בערכים מ-managerInfo אם קיימים, אחרת fallback
    const newMessage: ManagerMessage = {
      uid: managerInfo.uid || uid || defaultManagerUid,
      business_id: managerInfo.business_id || defaultBusinessId,
      text: inputValue.trim(),
      created_at: new Date().toISOString(),
    };

    fetch(`${baseUrl}/manager-messages/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error creating message");
        }
        return res.json();
      })
      .then((createdMessage: ManagerMessage) => {
        setMessages((prev) => [...prev, createdMessage]);
        scrollToBottom();
      })
      .catch((err) => console.error("Error posting message:", err));

    setInputValue("");
    setShowInput(false);
  };

  // מחיקת הודעה (DELETE) – זמינה רק למנהלים
  const handleDeleteMessage = (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    // ניתן להמיר ל-ObjectId אם צריך – כאן נניח שהשרת מקבל מחרוזת מזהה
    fetch(`${baseUrl}/manager-messages/delete/${messageId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error deleting message");
        }
        return res.json();
      })
      .then(() => {
        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      })
      .catch((err) => console.error("Error deleting message:", err));
  };

  // הפעלת מצב עריכה עבור הודעה מסוימת
  const handleEditMessage = (message: ManagerMessage) => {
    setEditingMessageId(message._id || null);
    setEditedText(message.text);
  };

  // שמירת עריכה (PUT) – עדכון ההודעה בשרת
  const handleSaveEdit = () => {
    if (!editingMessageId) return;

    fetch(`${baseUrl}/manager-messages/update/${editingMessageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: editedText,
        last_updated: new Date().toISOString(),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error updating message");
        }
        return res.json();
      })
      .then((updatedMessage: ManagerMessage) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === editingMessageId ? updatedMessage : msg
          )
        );
        setEditingMessageId(null);
        setEditedText("");
        scrollToBottom();
      })
      .catch((err) => console.error("Error updating message:", err));
  };

  // ביטול מצב עריכה
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedText("");
  };

  // ----------------------
  // תצוגה (JSX)
  // ----------------------
  return (
    <aside className="h-[calc(100vh-8rem-2rem)] bg-[#F7FAFC]/70 backdrop-blur-md flex flex-col border border-gray-300 rounded-3xl p-4 shadow-lg">
      {/* כותרת קבועה */}
      <div className="text-lg font-bold mb-4 text-center border-b border-gray-300 pb-2">
        System Messages
      </div>

      {/* אזור ההודעות עם גלילה */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="chat chat-start">
              {/* תמונת הפרופיל של המנהל */}
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Manager Avatar"
                    src={
                      managerInfo.profile_picture ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                  />
                </div>
              </div>
              <div>
                {/* הצגת שם המנהל מעל ההודעה */}
                <div className="text-sm text-gray-500">
                  {managerInfo.first_name && managerInfo.last_name
                    ? `${managerInfo.first_name} ${managerInfo.last_name}`
                    : "Loading..."}
                </div>
                {/* במצב עריכה, מציגים input */}
                {editingMessageId === msg._id ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn btn-xs btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* תוכן ההודעה */}
                    <div className="chat-bubble">{msg.text}</div>
                    {/* תאריך יצירת ההודעה מתחת, מוצג רק התאריך */}
                    <div className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </div>
                  </>
                )}
                {/* כפתורי עריכה ומחיקה – זמינים רק למנהלים */}
                {role === "manager" && editingMessageId !== msg._id && (
                  <div className="flex gap-2 mt-1">
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => handleEditMessage(msg)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-xs btn-outline btn-error"
                      onClick={() => msg._id && handleDeleteMessage(msg._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* תיבת הקלט לשליחת הודעה – זמינה רק למנהלים */}
      {role === "manager" && (
        <div className="pt-4 border-t border-gray-300 mt-2">
          {showInput ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter your system message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setShowInput(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-circle btn-primary w-full"
              onClick={() => setShowInput(true)}
            >
              <span className="text-xl">+</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
