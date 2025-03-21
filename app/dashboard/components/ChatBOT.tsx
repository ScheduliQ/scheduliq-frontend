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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    }
  };

  // Trigger initialization when the chat window opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, messages]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    // Append the user's message to the conversation
    setMessages((prev) => [...prev, { text: message, sender: "user" }]);
    const currentMessage = message;
    setMessage("");

    try {
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
    }
  };

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
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-blue-100 text-blue-800 self-end ml-auto"
                      : "bg-gray-100 text-gray-800 self-start"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t flex">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="הקלד הודעה..."
                className="flex-grow p-2 border rounded-l-lg"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
