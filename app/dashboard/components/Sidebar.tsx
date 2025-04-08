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
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
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

  // Determine color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 border-red-500 text-red-800";
      case "important":
        return "bg-amber-100 border-amber-500 text-amber-800";
      case "update":
        return "bg-green-100 border-green-500 text-green-800";
      default:
        return "";
    }
  };

  // ----------------------
  // useEffect Calls
  // ----------------------

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
      scrollToBottom();
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
        scrollToBottom();
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

  // ----------------------
  // JSX Render
  // ----------------------
  return (
    <aside className="h-[calc(100vh-8rem-2rem)] bg-white flex flex-col border border-gray-200 rounded-xl p-4 shadow-lg">
      {/* Fixed header */}
      <div className="text-xl font-bold mb-4 text-center border-b border-gray-200 pb-3 text-blue-700">
        System message
      </div>

      {/* Message display area with auto-scroll */}
      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`rounded-xl border-l-4 shadow-md bg-white overflow-hidden ${getPriorityColor(
                msg.priority
              )}`}
            >
              {/* Header with profile picture, name, and options dropdown */}
              <div className="flex items-center p-3 bg-blue-100/50 border-b border-blue-200 relative">
                <div className="flex-shrink-0">
                  <img
                    alt="Manager Avatar"
                    src={
                      msg.profile_picture ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                    className="w-10 h-10 rounded-full border-2 border-blue-300 object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-blue-800">
                    {msg.first_name && msg.last_name
                      ? `${msg.first_name} ${msg.last_name}`
                      : "Loading..."}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(msg.created_at)}
                  </p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      msg.priority
                    )}`}
                  >
                    {msg.priority}
                  </span>
                </div>
                {/* Options dropdown trigger (three dots) */}
                {role === "manager" && uid === msg.uid && (
                  <div className="absolute right-3 top-3">
                    <button
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                      onClick={() =>
                        setOpenOptionsMessageId(
                          openOptionsMessageId === msg._id
                            ? null
                            : msg._id || null
                        )
                      }
                    >
                      ⋮
                    </button>
                    {openOptionsMessageId === msg._id && (
                      <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-gray-100"
                          onClick={() => handleEditMessage(msg)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() =>
                            msg._id && handleDeleteMessage(msg._id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message content */}
              <div className="p-4">
                {editingMessageId === msg._id ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      className="w-full p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-24"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {msg.text}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message input area for managers */}
      {role === "manager" && (
        <div className="pt-4 border-t border-gray-200 mt-2 ">
          {showInput ? (
            <div className="flex flex-col gap-3">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-24"
                placeholder="Enter a new message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="px-4 py-2 border rounded-md text-gray-700"
                >
                  <option value="update">update</option>
                  <option value="important">important</option>
                  <option value="urgent">urgent</option>
                </select>
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  onClick={() => setShowInput(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
              onClick={() => setShowInput(true)}
            >
              <span>New message +</span>
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
