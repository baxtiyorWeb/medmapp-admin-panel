"use client";

import { PaperclipIcon, Send, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BsChatDotsFill,
  BsClipboard2PlusFill,
  BsFileEarmarkMedicalFill,
} from "react-icons/bs";
import api from "@/utils/api";
import axios from "axios";
// --- Backend API turlari (Interfaces)
export interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
}

export interface ApiAttachment {
  id: number;
  file: string;
  mime_type: string;
  size: number;
  original_name: string;
  uploaded_at: string;
  uploader: ApiUser;
  uploader_role: "patient" | "doctor";
}

export interface ApiMessage {
  id: number;
  type: "text" | "file" | "system";
  content: string;
  sender: ApiUser;
  created_at: string;
  attachments: ApiAttachment[];
}

export interface ApiDoctorSummary {
  id: number;
  diagnosis: string;
  recommendations: string;
  recommendations_list: string[];
}

export interface ApiPrescription {
  id: number;
  name: string;
  instruction: string;
  duration_days: number | null;
  notes: string;
}

export interface ApiParticipant {
  id: number;
  role: "patient" | "doctor" | "operator";
  first_name: string;
  last_name: string;
}

export interface ApiConversation {
  id: number;
  title: string;
  is_active: boolean;
  last_message_at: string;
  last_message_preview: string;
  unread_count: number;
  participants: ApiParticipant[];
}

// --- API Funksiyalari
const getConsultations = async (): Promise<ApiConversation[]> => {
  const response = await api.get("/consultations/conversations/");
  return response.data;
};

const getMessages = async (conversationId: number): Promise<ApiMessage[]> => {
  const response = await api.get(
    `/consultations/conversations/${conversationId}/messages/`
  );
  return response.data;
};

const getDoctorSummary = async (
  conversationId: number
): Promise<ApiDoctorSummary | null> => {
  try {
    const response = await api.get(
      `/consultations/conversations/${conversationId}/summary/`
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

const getPrescriptions = async (
  conversationId: number
): Promise<ApiPrescription[]> => {
  const response = await api.get(
    `/consultations/conversations/${conversationId}/prescriptions/`
  );
  return response.data;
};

const getAttachments = async (
  conversationId: number
): Promise<ApiAttachment[]> => {
  const response = await api.get(
    `/consultations/conversations/${conversationId}/files/`
  );
  return response.data;
};

const sendMessage = async (
  conversationId: number,
  content: string
): Promise<ApiMessage> => {
  const endpoint = `/consultations/conversations/${conversationId}/messages/`;
  const payload = { content, type: "text" };
  const response = await api.post(endpoint, payload);
  return response.data;
};

// =================================================================
// 2. MA'LUMOTLARNI MOSLASHTIRISH (Data Mappers & Frontend Types)
// Backend'dan kelgan ma'lumotlarni frontend'ga moslash
// =================================================================

// --- Frontend'da ishlatiladigan turlar (Interfaces)
interface Doctor {
  name: string;
  specialty: string;
  avatar: string;
  id: number;
}
interface Message {
  id: number;
  from: "doctor" | "patient";
  text: string;
  time: string;
}
interface File {
  name: string;
  size: string;
  by: "Bemor" | "Shifokor";
}
interface Note {
  diagnosis: string;
  recommendations: string[];
}
interface Prescription {
  name: string;
  instruction: string;
  duration: string;
}
export interface Consultation {
  id: number;
  doctor: Doctor;
  lastMessage: string;
  timestamp: string;
  unread: number;
  active: boolean;
  files: File[];
  messages: Message[];
  notes: Note | null;
  prescriptions: Prescription[];
}

// --- Mapper Funksiyalari
const mapApiConversationToFrontendList = (
  apiConvo: ApiConversation
): Consultation => {
  const doctorParticipant = apiConvo.participants.find(
    (p) => p.role === "doctor"
  );

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    id: apiConvo.id,
    doctor: {
      id: doctorParticipant?.id || 0,
      name: `Dr. ${doctorParticipant?.first_name || ""} ${
        doctorParticipant?.last_name || ""
      }`.trim(),
      specialty: "Kardiolog", // Placeholder, bu ma'lumot API'da yo'q
      avatar: `https://placehold.co/100x100?text=${
        doctorParticipant?.first_name?.[0] || "D"
      }${doctorParticipant?.last_name?.[0] || ""}`,
    },
    lastMessage: apiConvo.last_message_preview,
    timestamp: formatTime(apiConvo.last_message_at),
    unread: apiConvo.unread_count,
    active: apiConvo.is_active,
    files: [],
    messages: [],
    notes: null,
    prescriptions: [],
  };
};

const mapDetailsToFrontendConsultation = (
  baseConsultation: Consultation,
  apiMessages: ApiMessage[],
  apiSummary: ApiDoctorSummary | null,
  apiPrescriptions: ApiPrescription[],
  apiAttachments: ApiAttachment[]
): Consultation => {
  const formatMessageTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("uz-UZ", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(1)) +
      " " +
      ["Bytes", "KB", "MB", "GB"][i]
    );
  };

  return {
    ...baseConsultation,
    messages: apiMessages.map((msg) => ({
      id: msg.id,
      from: msg.sender.id === baseConsultation.doctor.id ? "doctor" : "patient",
      text: msg.content,
      time: formatMessageTime(msg.created_at),
    })),
    notes: apiSummary
      ? {
          diagnosis: apiSummary.diagnosis,
          recommendations: apiSummary.recommendations_list,
        }
      : null,
    prescriptions: apiPrescriptions.map((p) => ({
      name: p.name,
      instruction: p.instruction,
      duration: p.duration_days
        ? `${p.duration_days} kun`
        : p.notes || "Ehtiyojga qarab",
    })),
    files: apiAttachments.map((f) => ({
      name: f.original_name,
      size: formatFileSize(f.size),
      by: f.uploader_role === "doctor" ? "Shifokor" : "Bemor",
    })),
  };
};

// =================================================================
// 3. REACT KOMPONENTI (Main Component Logic)
// =================================================================

const ConsultationPage: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [newMessage, setNewMessage] = useState("");

  const chatInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [selectedConsultation?.messages, activeTab]);

  const handleSelectConsultation = useCallback(
    async (consultation: Consultation) => {
      if (isLoadingDetails || selectedConsultation?.id === consultation.id)
        return;

      try {
        setIsLoadingDetails(true);
        setSelectedConsultation(null);
        setActiveTab("chat");

        const [messages, summary, prescriptions, attachments] =
          await Promise.all([
            getMessages(consultation.id),
            getDoctorSummary(consultation.id),
            getPrescriptions(consultation.id),
            getAttachments(consultation.id),
          ]);

        const fullData = mapDetailsToFrontendConsultation(
          consultation,
          messages,
          summary,
          prescriptions,
          attachments
        );
        setSelectedConsultation(fullData);
      } catch (error) {
        console.error("Failed to fetch consultation details:", error);
      } finally {
        setIsLoadingDetails(false);
      }
    },
    [isLoadingDetails, selectedConsultation] // dependencies
  );

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoadingList(true);
        const apiData = await getConsultations();
        const mappedData = apiData.map(mapApiConversationToFrontendList);
        setConsultations(mappedData);
        if (mappedData.length > 0) {
          handleSelectConsultation(mappedData[0]);
        }
      } catch (error) {
        console.error("Failed to fetch consultations:", error);
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchInitialData();
  }, [handleSelectConsultation]); // ✅ qo‘shish kerak

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConsultation) return;

    const tempMessage: Message = {
      id: Date.now(),
      from: "patient",
      text: newMessage,
      time: new Date().toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setSelectedConsultation((prev) =>
      prev ? { ...prev, messages: [...prev.messages, tempMessage] } : null
    );

    const messageContent = newMessage;
    setNewMessage("");
    chatInputRef.current?.focus();

    try {
      const sentMessage = await sendMessage(
        selectedConsultation.id,
        messageContent
      );
      setSelectedConsultation((prev: Consultation | null) => {
        if (!prev) return null;
        const newMessages = prev.messages.map((msg: Message) =>
          msg.id === tempMessage.id
            ? {
                id: sentMessage.id,
                from: "patient" as const,
                text: sentMessage.content,
                time: new Date(sentMessage.created_at).toLocaleTimeString(
                  "uz-UZ",
                  { hour: "2-digit", minute: "2-digit" }
                ),
              }
            : msg
        );
        return { ...prev, messages: newMessages };
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setSelectedConsultation((prev) =>
        prev
          ? {
              ...prev,
              messages: prev.messages.filter((m) => m.id !== tempMessage.id),
            }
          : null
      );
      setNewMessage(messageContent);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  // --- RENDER FUNKSIYALARI (UI qismi) ---
  const renderConsultationList = () => (
    <div id="consultation-list" className="overflow-y-auto flex-grow p-2">
      {isLoadingList ? (
        <div className="flex justify-center items-center h-full text-slate-500">
          <Loader2 className="animate-spin mr-2" /> Yuklanmoqda...
        </div>
      ) : (
        consultations.map((con) => (
          <div
            key={con.id}
            onClick={() => handleSelectConsultation(con)}
            className={`consultation-item cursor-pointer p-3 flex items-center gap-4 rounded-xl transition-colors ${
              selectedConsultation?.id === con.id
                ? "bg-[var(--card-background)]"
                : "hover:bg-[var(--input-bg)]"
            }`}
          >
            <div className="relative flex-shrink-0">
              <Image
                src={con.doctor.avatar}
                alt={con.doctor.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />
              {con.active && (
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-[#21C55D] ring-2 ring-white "></span>
              )}
            </div>
            <div className="flex-grow overflow-hidden">
              <div className="flex justify-between items-center">
                <h4
                  className={`font-bold text-sm truncate ${
                    selectedConsultation?.id === con.id
                      ? "text-[#4152f1]"
                      : "text-[var(--text-color)]"
                  }`}
                >
                  {con.doctor.name}
                </h4>
                <span className="text-xs text-slate-500 flex-shrink-0">
                  {con.timestamp}
                </span>
              </div>
              <div className="flex justify-between items-start">
                <p className="text-sm text-slate-500 truncate">
                  {con.lastMessage}
                </p>
                {con.unread > 0 && (
                  <span className="flex-shrink-0 ml-2 w-5 h-5 bg-[#4152f1] text-white text-xs flex items-center justify-center rounded-full">
                    {con.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const ChatPane: React.FC<{ messages: Message[] }> = ({ messages }) => (
    <div id="chat-pane" className="tab-pane p-4 sm:p-6 space-y-4 chat-body">
      {messages.map((msg, index) => (
        <div
          key={msg.id}
          className={`flex ${
            msg.from === "patient" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="max-w-xs lg:max-w-md">
            <div
              className={`message-content py-2 px-4 rounded-2xl ${
                msg.from === "patient"
                  ? "bg-[#4152f1] text-white rounded-br-lg"
                  : "bg-[var(--input-bg)] rounded-bl-lg"
              }`}
            >
              {msg.text}
            </div>
            <p
              className={`text-xs text-slate-400 mt-1 ${
                msg.from === "patient" ? "text-right" : "text-left"
              }`}
            >
              {msg.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  // Asl koddan NotesPane, PrescriptionsPane, FilesPane o'zgarishsiz qoladi...

  const renderChatPanel = () => {
    if (isLoadingDetails) {
      return (
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg">
          <Loader2 className="w-12 h-12 animate-spin text-slate-400" />
          <p className="mt-4 text-slate-500">Suhbat yuklanmoqda...</p>
        </div>
      );
    }
    if (!selectedConsultation) {
      return (
        <div
          id="placeholder-panel"
          className="col-span-12 lg:col-span-8 xl:col-span-9 h-full flex flex-col items-center justify-center text-center bg-[var(--card-background)] rounded-2xl shadow-lg p-8"
        >
          <BsChatDotsFill className="text-7xl text-slate-300" />
          <h3 className="mt-4 text-xl font-bold text-[var(--text-color)]">
            Suhbatni tanlang
          </h3>
          <p className="text-slate-500">
            Ko&apos;rish uchun chapdagi ro&apos;yxatdan suhbatni tanlang.
          </p>
        </div>
      );
    }

    return (
      <div
        id="chat-panel"
        className="col-span-12 lg:col-span-8 xl:col-span-9 h-full flex flex-col"
      >
        <div className="bg-[var(--card-background)] rounded-2xl shadow-lg h-full flex flex-col">
          <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-4 flex-shrink-0">
            <Image
              width={100}
              height={100}
              src={selectedConsultation.doctor.avatar}
              className="w-11 h-11 rounded-full"
              alt={selectedConsultation.doctor.name}
            />
            <div>
              <h3 className="font-bold text-[var(--text-color)]">
                {selectedConsultation.doctor.name}
              </h3>
              <p className="text-sm text-slate-500">
                {selectedConsultation.doctor.specialty}
              </p>
            </div>
          </div>
          <div className="border-b border-slate-200 px-2 sm:px-4 flex-shrink-0">
            <nav className="flex space-x-2" id="infoTab">
              {["chat", "notes", "prescriptions", "files"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-btn whitespace-nowrap cursor-pointer py-3 px-4 border-b-2 font-semibold flex justify-center items-center ${
                    activeTab === tab
                      ? "text-[#4153F1] border-[#4153F1]"
                      : "text-slate-500 border-transparent hover:text-[#4152F1] hover:border-[#4152F1]"
                  }`}
                >
                  {tab === "chat" && (
                    <>
                      <BsChatDotsFill className="mr-2" />
                      Chat
                    </>
                  )}
                  {tab === "notes" && (
                    <>
                      <BsClipboard2PlusFill className="mr-2" />
                      Shifokor xulosasi
                    </>
                  )}
                  {tab === "prescriptions" && (
                    <>
                      <BsFileEarmarkMedicalFill className="mr-2" />
                      Retseptlar
                    </>
                  )}
                  {tab === "files" && (
                    <>
                      <PaperclipIcon className="mr-2 w-4 h-4" />
                      Fayllar
                    </>
                  )}
                </button>
              ))}
            </nav>
          </div>
          <div
            id="tab-content-container"
            className="flex-grow overflow-y-auto min-h-0"
            ref={scrollContainerRef}
          >
            {activeTab === "chat" && (
              <ChatPane messages={selectedConsultation.messages} />
            )}
            {/* Boshqa tab'lar uchun panellar shu yerda chaqiriladi... */}
          </div>
          {activeTab === "chat" && (
            <div
              id="chat-footer"
              className="p-4 border-t border-[var(--border-color)] bg-[var(--input-bg)] flex-shrink-0"
            >
              <div className="relative">
                <input
                  id="chat-input"
                  type="text"
                  placeholder="Xabar yozing..."
                  className="w-full placeholder:text-[var(--text-color)] pl-4 pr-20 py-3 bg-[var(--background-color)] border border-[var(--border-color)] rounded-full focus:ring-2 focus:ring-[#4152f1] focus:outline-none"
                  ref={chatInputRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <button className="p-2 text-slate-500 hover:text-[#4152f1]">
                    <PaperclipIcon className="w-5 h-5" />
                  </button>
                  <button
                    id="send-btn"
                    onClick={handleSendMessage}
                    className="ml-1 w-10 h-10 bg-[#4152f1] text-white rounded-full flex items-center justify-center hover:bg-[#3546d1] transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="flex-1 overflow-hidden h-full">
      <div className="h-full grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 h-full">
          <div className="bg-[var(--card-background)] rounded-2xl shadow-lg h-full flex flex-col">
            <div className="p-4 border-b border-[var(--border-color)]">
              <h2 className="font-bold text-[var(--text-color)]">Suhbatlar</h2>
            </div>
            {renderConsultationList()}
          </div>
        </div>
        {renderChatPanel()}
      </div>
    </main>
  );
};

export default ConsultationPage;
