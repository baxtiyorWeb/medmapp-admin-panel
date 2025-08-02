// components/Chat.tsx
"use client";
import React, { useState } from "react";

const Chat = () => {
  // Foydalanuvchilar ro'yxati
  const [users] = useState([
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
      name: "Sarvinoz Karimova",
      initials: "S",
      lastMessage: "Rahmat, aytganlaringizni qilyapman.",
      time: "Kecha",
      unread: 0,
      active: false,
    },
  ]);

  // Xabarlar ro'yxati
  const [messages] = useState([
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
  ]);

  // Faol foydalanuvchi uchun state
  const [activeUser] = useState(users[0]);

  return (
    <div className="wrapper flex h-screen bg-gray-100 font-sans">
      <div className="main-content flex-1 flex flex-col overflow-hidden">
        <main className="page-content flex-1 overflow-hidden">
          <div className="chat-container flex h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="chat-list w-80 border-r border-gray-200 flex flex-col">
              <div className="chat-list-header p-4 border-b border-gray-200">
                <div className="input-group flex items-center">
                  <span className="input-group-text bg-transparent border-r-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control outline-none border border-gray-500/50 rounded-lg  w-full px-3 py-2  focus:ring-none"
                    placeholder="Bemorlarni qidirish..."
                  />
                </div>
              </div>
              <div className="chat-list-body flex-grow overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`chat-item border  flex items-center p-4 cursor-pointer border-b border-gray-200 ${
                      user.active
                        ? "bg-[#4153F1] text-white"
                        : ""
                    }`}
                  >
                    <img
                      src={`https://placehold.co/48x48/EFEFEF/333333?text=${user.initials}`}
                      className="avatar w-12 h-12 rounded-full mr-4"
                      alt={user.name}
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h6
                          className={`mb-1 font-bold ${
                            user.active ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user.name}
                        </h6>
                        <small
                          className={
                            user.active ? "text-gray-300" : "text-gray-500"
                          }
                        >
                          {user.time}
                        </small>
                      </div>
                      <div className="flex justify-between">
                        <p
                          className={`text-sm truncate`}
                          style={{
                            maxWidth: user.active ? "150px" : "180px",
                            color: user.active ? "#d1d5db" : "#6b7280",
                          }}
                        >
                          {user.lastMessage}
                        </p>
                        {user.unread > 0 && (
                          <span
                            className={`unread-count text-xs font-semibold px-2 py-1 rounded-full ${
                              user.active
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
            <div className="chat-area flex-1 flex flex-col">
              <div className="chat-header p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={`https://placehold.co/40x40/EFEFEF/333333?text=${activeUser.initials}`}
                    className="avatar w-10 h-10 rounded-full mr-3"
                    alt={activeUser.name}
                  />
                  <div>
                    <h6 className="mb-0 font-bold">{activeUser.name}</h6>
                    <small className="text-green-500">Online</small>
                  </div>
                </div>
                <button
                  className="btn btn-light px-2 py-1 text-gray-600 hover:text-gray-800"
                  data-bs-toggle="tooltip"
                  title="Bemor kartasi"
                >
                  <i className="bi bi-person-vcard"></i>
                </button>
              </div>
              <div className="chat-body flex-grow p-6 overflow-y-auto flex flex-col space-y-4">
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
              <div className="chat-footer p-4 border-t border-gray-200">
                <div className="input-group flex items-center">
                  <button
                    className="btn btn-light border px-2 py-1 mr-2"
                    type="button"
                  >
                    <i className="bi bi-paperclip"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control flex-1 px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Xabar yozing..."
                  />
                  <button
                    className="btn bg-blue-600 text-white px-4 py-2 ml-2"
                    type="button"
                  >
                    <i className="bi bi-send-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="mobile-overlay fixed inset-0 bg-black bg-opacity-50 hidden"></div>
    </div>
  );
};

export default Chat;
