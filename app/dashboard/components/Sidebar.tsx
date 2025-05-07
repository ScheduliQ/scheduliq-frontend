"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRole } from "../../../hooks/RoleContext";
import {
  initiateSocketConnection,
  disconnectSocket,
} from "../../../hooks/socket"; // SOCKET: Import socket functions
import { Socket } from "socket.io-client"; // SOCKET: Import Socket type

// ----------------------
// Interfaces
// ----------------------

// ManagerMessage schema with all fields (according to new manager_messages_schema)
// Note: We add an optional sid field for sending the sender's socket ID.
interface ManagerMessage {
  _id?: string;
  uid: string;
  business_id: string;
  text: string;
  created_at: string;
  last_updated?: string;
  priority: string;
  profile_picture: string;
  first_name: string;
  last_name: string;
  sid?: string; // optional field for sender's socket id
}

// ManagerInfo interface (used for fetching manager data)
interface ManagerInfo {
  uid: string;
  business_id: string;
  profile_picture: string;
  first_name: string;
  last_name: string;
}

// ----------------------
// Main Component
// ----------------------
export default function Sidebar() {
  const { role, uid } = useRole();

  // State for messages, input, message type (priority), etc.
  const [messages, setMessages] = useState<ManagerMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [messageType, setMessageType] = useState("update");

  // Default ManagerInfo (all fields empty)
  const defaultManagerInfo: ManagerInfo = {
    uid: "",
    business_id: "",
    profile_picture: "",
    first_name: "",
    last_name: "",
  };
  const [managerInfo, setManagerInfo] =
    useState<ManagerInfo>(defaultManagerInfo);

  // State for editing mode
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // SOCKET: Create a ref to hold the socket instance so we can access it later.
  const socketRef = useRef<Socket | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // ----------------------
  // Helper Functions
  // ----------------------

  // Format date into a friendly string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("he-IL", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Auto-scroll to the bottom of the messages list
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // Fetch messages from the server (GET)
  const fetchMessages = () => {
    fetch(`${baseUrl}/manager-messages/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data: ManagerMessage[]) => {
        // Reverse messages if returned newest first
        setMessages(data.reverse());
        scrollToBottom();
      })
      .catch((err) => console.error("Error fetching messages:", err));
  };

  // Determine priority styling
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "urgent":
        return {
          indicator: "bg-red-500",
          text: "text-gray-900",
        };
      case "important":
        return {
          indicator: "bg-amber-500",
          text: "text-gray-900",
        };
      case "update":
        return {
          indicator: "bg-emerald-500",
          text: "text-gray-900",
        };
      default:
        return {
          indicator: "bg-gray-400",
          text: "text-gray-900",
        };
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Fetch manager info when UID is available
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

  // SOCKET: Initialize socket connection and subscribe to events
  useEffect(() => {
    const socket = initiateSocketConnection(); // SOCKET: Initiate connection
    socketRef.current = socket; // Save the socket instance to our ref

    socket.on("new_manager_message", (newMessage: ManagerMessage) => {
      setMessages((prev) => {
        // Avoid duplicates by checking _id
        if (prev.some((msg) => msg._id === newMessage._id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
      // Use setTimeout to ensure scrolling happens after state update and rendering
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    });
    socket.on("update_manager_message", (updatedMessage: ManagerMessage) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });
    socket.on("delete_manager_message", (data: { _id: string }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== data._id));
    });
    return () => {
      socket.off("new_manager_message");
      socket.off("update_manager_message");
      socket.off("delete_manager_message");
      // Optionally disconnect the socket:
      // disconnectSocket();
    };
  }, []);

  // ----------------------
  // Message Actions: Create, Edit, Delete
  // ----------------------

  // Create a new message (POST)
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    if (!uid || !managerInfo.uid || !managerInfo.business_id) {
      console.error("Manager info is not fully loaded.");
      return;
    }
    // Build the new message and include the sender's socket id in the payload
    const newMessage: ManagerMessage = {
      uid: managerInfo.uid,
      business_id: managerInfo.business_id,
      text: inputValue.trim(),
      created_at: new Date().toISOString(),
      priority: messageType,
      profile_picture: managerInfo.profile_picture,
      first_name: managerInfo.first_name,
      last_name: managerInfo.last_name,
      sid: socketRef.current?.id, // <-- SEND the socket id with the message
    };
    console.log(`the sid: ${newMessage.sid} `);

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
        // Use setTimeout to ensure scrolling happens after state update and rendering
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      })
      .catch((err) => console.error("Error posting message:", err));

    setInputValue("");
    setShowInput(false);
  };

  // Delete a message (DELETE) – available only for managers
  const handleDeleteMessage = (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

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

  // Enable edit mode for a specific message
  const handleEditMessage = (message: ManagerMessage) => {
    setEditingMessageId(message._id || null);
    setEditedText(message.text);
    setOpenOptionsMessageId(null); // SOCKET: close options menu if open
  };

  // Save edited message (PUT) – update message on the server
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
      })
      .catch((err) => console.error("Error updating message:", err));
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedText("");
  };

  // State for tracking which message's options dropdown is open (three dots)
  const [openOptionsMessageId, setOpenOptionsMessageId] = useState<
    string | null
  >(null);

  return (
    <aside className="h-[calc(100vh-8rem-2rem)] bg-white flex flex-col rounded-3xl overflow-hidden">
      {/* Header */}
      <header className="text-xl font-semibold py-4 text-center border-b text-gray-800 flex items-center justify-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>System Messages</span>
      </header>

      {/* Message display area with auto-scroll */}
      <section className="flex-1 overflow-y-auto p-4 w-full mt-4">
        {messages.map((msg, index) => {
          const priorityStyles = getPriorityStyles(msg.priority);
          return (
            <article
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-4 last:mb-0"
            >
              <header className="flex items-center p-3 border-b border-gray-100">
                <img
                  alt="Manager"
                  src={
                    msg.profile_picture ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />

                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {msg.first_name && msg.last_name
                        ? `${msg.first_name} ${msg.last_name}`
                        : "Loading..."}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(msg.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${priorityStyles.indicator}`}
                    ></div>
                    <span className="text-xs text-gray-500 capitalize">
                      {msg.priority}
                    </span>

                    {/* Options menu for managers */}
                    {role === "manager" && uid === msg.uid && (
                      <div className="relative ml-2">
                        <button
                          className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                          onClick={() =>
                            setOpenOptionsMessageId(
                              openOptionsMessageId === msg._id
                                ? null
                                : msg._id || null
                            )
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                          </svg>
                        </button>
                        {openOptionsMessageId === msg._id && (
                          <div className="absolute right-0 top-8 w-32 bg-white border border-gray-100 rounded-lg shadow-md z-10 overflow-hidden">
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                              onClick={() => handleEditMessage(msg)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              Edit
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                              onClick={() =>
                                msg._id && handleDeleteMessage(msg._id)
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </header>

              {/* Message content */}
              <div className="p-4">
                {editingMessageId === msg._id ? (
                  <div>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 min-h-24 bg-white"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-3">
                      <button
                        className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium border border-gray-200"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={`${priorityStyles.text} whitespace-pre-wrap`}>
                    {msg.text}
                  </p>
                )}
              </div>
            </article>
          );
        })}
        <div ref={messagesEndRef} />
      </section>

      {/* Message input area for managers */}
      {role === "manager" && (
        <footer className="border-t border-gray-200 p-4">
          {showInput ? (
            <>
              <textarea
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 resize-none min-h-24 bg-white/50 backdrop-blur-sm font-sans text-[15px] placeholder:text-gray-400"
                placeholder="Enter a new message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4">
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 bg-white/50 backdrop-blur-sm font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50"
                >
                  <option value="update">Update</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 font-medium border border-gray-200 font-sans text-[15px]"
                    onClick={() => setShowInput(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-medium shadow-sm hover:shadow-md font-sans text-[15px]"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <button
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md hover:from-blue-700 hover:to-blue-800 font-medium font-sans text-[15px] tracking-wide"
              onClick={() => setShowInput(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              <span>New Message</span>
            </button>
          )}
        </footer>
      )}
    </aside>
  );
}
