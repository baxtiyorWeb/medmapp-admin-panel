"use client";

import React, { useState, useEffect } from "react";
import { Paperclip, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";

const usersData = [
  {
    id: 1,
    name: "Ali Valiyev",
    initials: "A",
    lastMessage: "Assalomu alaykum, doktor. Analiz natijalari...",
    time: "10:30",
    unread: 2,
    active: true,
  },
  {
    id: 2,
    name: "Sarvinoz Karimovas",
    initials: "S",
    lastMessage: "Rahmat, aytganlaringizni qilyapman.",
    time: "Kecha",
    unread: 0,
    active: false,
  },
];

const messagesData = [
  {
    id: 1,
    sender: "Ali Valiyev",
    time: "10:25",
    text: "Assalomu alaykum, doktor. Analiz natijalari tayyor bo'ldimi?",
    isSelf: false,
  },
  {
    id: 2,
    sender: "Dr. Salima Nosirova",
    time: "10:28",
    text: "Vaalaikum assalom, Ali aka. Ha, hozirgina keldi. Hammasi joyida, xavotirga o'rin yo'q.",
    isSelf: true,
  },
  {
    id: 3,
    sender: "Ali Valiyev",
    time: "10:30",
    text: "Judayam yaxshi, rahmat!",
    isSelf: false,
  },
];

const Chat = () => {
  const [users] = useState(usersData);
  const [messages] = useState(messagesData);

  const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(
    null
  );

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );



  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (!mobile) setSelectedUser(null);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile && users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [isMobile, users, selectedUser]);

  return (
    <div className="wrapper flex h-[80dvh] bg-gray-100 font-sans relative">
      {(!selectedUser || !isMobile) && (
        <div className="chat-list w-full sm:w-80 border-r border-gray-200 flex flex-col bg-white">
          <div className="chat-list-header p-4 border-b border-gray-200">
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Bemorlarni qidirish..."
            />
          </div>
          <div className="chat-list-body flex-grow overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`chat-item flex cursor-pointer items-center border-b border-gray-200 p-4 transition-colors duration-200 ${
                  selectedUser?.id === user.id
                    ? "bg-[#4153F1] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <img
                  src={`https://placehold.co/48x48/EFEFEF/333333?text=${user.initials}`}
                  alt={user.name}
                  className="avatar w-12 h-12 rounded-full mr-4 flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h6
                      className={`mb-1 font-bold ${
                        selectedUser?.id === user.id
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {user.name}
                    </h6>
                    <small
                      className={
                        selectedUser?.id === user.id
                          ? "text-gray-300"
                          : "text-gray-500"
                      }
                    >
                      {user.time}
                    </small>
                  </div>
                  <div className="flex justify-between">
                    <p
                      className="text-sm truncate"
                      style={{
                        maxWidth:
                          selectedUser?.id === user.id ? "150px" : "180px",
                        color:
                          selectedUser?.id === user.id ? "#d1d5db" : "#6b7280",
                      }}
                    >
                      {user.lastMessage}
                    </p>
                    {user.unread > 0 && (
                      <span
                        className={`unread-count text-xs font-semibold px-2 py-1 rounded-full ${
                          selectedUser?.id === user.id
                            ? "bg-white text-blue-600"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {user.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(selectedUser || !isMobile) && (
        <div className="chat-area flex-1 flex flex-col bg-white relative">
          {isMobile && (
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute -top-0 right-0 z-30 rounded-full bg-white px-3 py-1 text-gray-700 shadow border hover:bg-gray-100 transition"
            >
              ← Ortga
            </button>
          )}

          <div className="chat-header flex items-center justify-between border-b border-gray-200 p-4">
            <div className="flex items-center">
              <img
                src={`https://placehold.co/40x40/EFEFEF/333333?text=${
                  selectedUser?.initials || ""
                }`}
                alt={selectedUser?.name || ""}
                className="avatar w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h6 className="mb-0 font-bold">{selectedUser?.name}</h6>
                <small className="text-green-500">Online</small>
              </div>
            </div>
            <button
              className="btn btn-light px-2 py-1 text-gray-600 hover:text-gray-800"
              title="Bemor kartasi"
              type="button"
            >
              <i className="bi bi-person-vcard"></i>
            </button>
          </div>

          <div className="chat-body flex-grow overflow-y-auto p-6 flex flex-col space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`message max-w-[70%] p-3 rounded-lg ${
                  msg.isSelf
                    ? "bg-blue-600 text-white rounded-br-none self-end"
                    : "bg-gray-100 rounded-bl-none self-start"
                }`}
              >
                <div className="text-sm">{msg.text}</div>
                <span
                  className="time block text-xs mt-1"
                  style={{ color: msg.isSelf ? "#93c5fd" : "#6b7280" }}
                >
                  {msg.time}
                </span>
              </div>
            ))}
          </div>

          <div className="chat-footer border-t border-gray-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <label
                htmlFor="file-upload"
                className="cursor-pointer rounded-full border p-2 hover:bg-gray-100 transition-colors"
              >
                <Paperclip className="w-5 h-5 text-gray-600" />
              </label>
              <input id="file-upload" type="file" className="hidden" multiple />

              <input
                type="text"
                placeholder="Xabar yozing..."
                className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
