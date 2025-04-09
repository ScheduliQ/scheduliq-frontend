"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to the bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to initialize the conversation when chat is opened.
  const initializeChat = async () => {
    try {
      setIsTyping(true);
      // Send a request to the /chatbot endpoint with a special "init" message.
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/chatbot`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "", first_message: true }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const botMessage = data.response;
      // Append the bot's greeting message to the conversation
      setMessages([{ text: botMessage, sender: "bot" }]);
    } catch (error: any) {
      setMessages([{ text: "Error: " + error.message, sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Trigger initialization when the chat window opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, messages]);

  // Auto-resize text area as content grows
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "40px"; // Reset height
      textAreaRef.current.style.height = `${Math.min(
        120,
        textAreaRef.current.scrollHeight
      )}px`;
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    // Append the user's message to the conversation
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    const currentMessage = message;
    setMessage("");

    try {
      setIsTyping(true);
      // Send the manager's message to the Flask /chatbot route
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/schedule/chatbot`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: currentMessage,
            first_message: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const botMessage = data.response;

      // Append the chatbot's reply to the conversation
      setMessages((prev) => [...prev, { text: botMessage, sender: "bot" }]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { text: "Error: " + error.message, sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Bot profile SVG
  const BotProfile = () => (
    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4" />
        <line x1="8" y1="16" x2="8" y2="16" />
        <line x1="16" y1="16" x2="16" y2="16" />
      </svg>
    </div>
  );

  // User profile SVG
  const UserProfile = () => (
    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: [0, -10, 10, 0],
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 },
        }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all"
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            exit={{
              opacity: 0,
              scale: 0.5,
              y: 50,
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="w-80 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col"
          >
            <div className="bg-blue-500 text-white p-4 rounded-t-xl flex justify-between items-center">
              <h3 className="font-semibold">SchedBot 🤖</h3>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-600 rounded-full p-1"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="p-4 h-64 overflow-y-auto flex flex-col">
              {messages.map((msg, index) => (
                <div key={index} className="flex items-start mb-3">
                  {msg.sender === "bot" && (
                    <div className="mr-2">
                      <BotProfile />
                    </div>
                  )}
                  <motion.div
                    initial={{
                      opacity: 0,
                      x: msg.sender === "user" ? 20 : -20,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.sender === "user"
                        ? "bg-blue-100 text-blue-800 ml-auto order-2"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                  {msg.sender === "user" && (
                    <div className="ml-2 order-3">
                      <UserProfile />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start mb-3">
                  <div className="mr-2">
                    <BotProfile />
                  </div>
                  <motion.div
                    className="bg-gray-100 p-2 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex space-x-1">
                      <motion.div
                        className="h-1.5 w-1.5 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                      />
                      <motion.div
                        className="h-1.5 w-1.5 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className="h-1.5 w-1.5 bg-gray-400 rounded-full"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </motion.div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t flex">
              <textarea
                ref={textAreaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow p-2 border rounded-l-lg max-h-32 min-h-10 resize-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
              >
                <Send size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbot;
