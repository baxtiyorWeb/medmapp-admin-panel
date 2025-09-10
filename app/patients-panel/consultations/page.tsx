"use client";

import { PaperclipIcon } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import {
  BsChatDotsFill,
  BsClipboard2PlusFill,
  BsFileEarmarkMedicalFill,
} from "react-icons/bs";
import "./consultations.css";

// Interfaces for better type safety
interface Doctor {
  name: string;
  specialty: string;
  avatar: string;
}

interface Message {
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

interface Consultation {
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

const ConsultationPage: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: 1,
      doctor: {
        name: "Dr. Salima Nosirova",
        specialty: "Kardiolog",
        avatar: "https://placehold.co/100x100/eef2ff/4154f1?text=SN",
      },
      lastMessage: "Retseptni yubordim, ko'rib chiqing.",
      timestamp: "10:45",
      unread: 1,
      active: true,
      files: [
        { name: "qon_analizi.pdf", size: "1.2 MB", by: "Bemor" },
        { name: "rentgen_surat.jpg", size: "850 KB", by: "Bemor" },
        { name: "qo'shimcha_xulosa.txt", size: "15 KB", by: "Shifokor" },
      ],
      messages: [
        {
          from: "doctor",
          text: "Assalomu alaykum, Ali aka. Yaxshimisiz? Shikoyatlaringizni eshitishga tayyorman.",
          time: "10:32",
        },
        {
          from: "patient",
          text: "Va alaykum assalom. Rahmat, yaxshi. Menda biroz bosh og'rig'i va holsizlik bor.",
          time: "10:33",
        },
        {
          from: "doctor",
          text: "Tushunarli. Yuborgan analizlaringizni ko'rib chiqdim. Hammasi joyida. Keling, bir nechta savol beraman.",
          time: "10:35",
        },
        {
          from: "doctor",
          text: "Retseptni yubordim, ko'rib chiqing.",
          time: "10:45",
        },
      ],
      notes: {
        diagnosis:
          "O'tkir respirator virusli infeksiya (O'RVI), astenik sindrom.",
        recommendations: [
          "Ko'proq suyuqlik ichish (malinali choy, namatak damlamasi).",
          "Yotoq rejimi (kamida 2-3 kun).",
          "Xonani tez-tez shamollatib turish.",
          "Quyidagi dori-darmonlarni qabul qilish.",
        ],
      },
      prescriptions: [
        {
          name: "Paratsetamol 500mg",
          instruction: "1 tabletkadan kuniga 3 mahal, ovqatdan so'ng",
          duration: "7 kun",
        },
        {
          name: "Vitamin C 1000mg",
          instruction: "Kuniga 1 mahal, ertalab",
          duration: "10 kun",
        },
        {
          name: "Ibuprofen 200mg",
          instruction: "Faqat kuchli og'riq bo'lganda",
          duration: "Ehtiyojga qarab",
        },
      ],
    },
    {
      id: 2,
      doctor: {
        name: "Dr. Anvar Jo'rayev",
        specialty: "Nevropatolog",
        avatar: "https://placehold.co/100x100/dcfce7/166534?text=AJ",
      },
      lastMessage: "MRT natijalarini kutyapman.",
      timestamp: "Kecha",
      unread: 0,
      active: false,
      files: [],
      messages: [],
      notes: null,
      prescriptions: [],
    },
    {
      id: 3,
      doctor: {
        name: "Dr. Malika Ahmedova",
        specialty: "Endokrinolog",
        avatar: "https://placehold.co/100x100/fee2e2/991b1b?text=MA",
      },
      lastMessage: "Yaxshi, rahmat!",
      timestamp: "2 kun oldin",
      unread: 0,
      active: false,
      files: [],
      messages: [],
      notes: null,
      prescriptions: [],
    },
  ]);

  const [selectedConsultationId, setSelectedConsultationId] = useState<
    number | null
  >(null);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const chatInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consultations.length > 0) {
      setSelectedConsultationId(consultations[0].id);
    }
  }, [consultations]);

  useEffect(() => {
    if (scrollContainerRef.current && activeTab === "chat") {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [activeTab, selectedConsultationId, consultations]);

  const selectedConsultation = consultations.find(
    (con) => con.id === selectedConsultationId
  );

  const handleSelectConsultation = (id: number) => {
    setSelectedConsultationId(id);
    setActiveTab("chat");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSendMessage = () => {
    if (!chatInputRef.current || !chatInputRef.current.value.trim()) return;

    // 1️⃣ Patient xabarini qo‘shish
    const updatedConsultations = consultations.map((con) => {
      if (con.id === selectedConsultationId) {
        return {
          ...con,
          messages: [
            ...con.messages,
            {
              from: "patient" as const, // endi TypeScript qabul qiladi
              text: chatInputRef.current!.value,
              time: new Date().toLocaleTimeString("uz-UZ", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ],
        };
      }
      return con;
    });

    setConsultations(updatedConsultations);

    chatInputRef.current.value = "";
    chatInputRef.current.focus();

    // 2️⃣ Doctor javobi
    setTimeout(() => {
      const updatedAgain = updatedConsultations.map((con) => {
        if (con.id === selectedConsultationId) {
          return {
            ...con,
            messages: [
              ...con.messages,
              {
                from: "doctor" as const, // type assertion qo‘shildi
                text: "Xabaringizni oldim, hozir ko'rib chiqaman.",
                time: new Date().toLocaleTimeString("uz-UZ", {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ],
          };
        }
        return con;
      });

      setConsultations(updatedAgain);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const renderConsultationList = () => (
    <div id="consultation-list" className="overflow-y-auto flex-grow p-2">
      <div
        className="consultation-item cursor-pointer p-3 flex items-center gap-4 rounded-xl transition-colors bg-[var(--card-background)] "
        data-id="1"
      >
        <div className="relative flex-shrink-0">
          <img
            src="https://placehold.co/100x100/eef2ff/4154f1?text=SN"
            className="w-12 h-12 rounded-full"
          />
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-[#21C55D] ring-2 ring-white "></span>
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm truncate text-[#4152f1]">
              Dr. Salima Nosirova
            </h4>
            <span className="text-xs text-slate-500 flex-shrink-0">10:45</span>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-sm text-slate-500 truncate">
              Retseptni yubordim, ko&apos;rib chiqing.
            </p>
            <span className="flex-shrink-0 ml-2 w-5 h-5 bg-[#4152f1] text-white text-xs flex items-center justify-center rounded-full">
              1
            </span>
          </div>
        </div>
      </div>

      <div
        className="consultation-item cursor-pointer p-3 flex items-center gap-4 rounded-xl transition-colors hover:bg-[var(--input-bg)]"
        data-id="2"
      >
        <div className="relative flex-shrink-0">
          <img
            src="https://placehold.co/100x100/dcfce7/166534?text=AJ"
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm truncate text-[var(--text-color)] hover:text-[var(--text-color)] ">
              Dr. Anvar Jo&apos;rayev
            </h4>
            <span className="text-xs text-slate-500 flex-shrink-0">Kecha</span>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-sm text-slate-500 truncate">
              MRT natijalarini kutyapman.
            </p>
          </div>
        </div>
      </div>

      <div
        className="consultation-item cursor-pointer p-3 flex items-center gap-4 rounded-xl transition-colors hover:bg-[var(--input-bg)]"
        data-id="3"
      >
        <div className="relative flex-shrink-0">
          <img
            src="https://placehold.co/100x100/fee2e2/991b1b?text=MA"
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div className="flex-grow overflow-hidden">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm truncate text-[var(--text-color)] hover:text-[var(--text-color)]">
              Dr. Malika Ahmedova
            </h4>
            <span className="text-xs text-slate-500 flex-shrink-0">
              2 kun oldin
            </span>
          </div>
          <div className="flex justify-between items-start">
            <p className="text-sm text-slate-500 truncate">Yaxshi, rahmat!</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ChatPane: React.FC<{ messages: Message[] }> = ({ messages }) => (
    <div
      id="chat-pane"
      className="tab-pane p-4 sm:p-6 space-y-4 chat-body"
      ref={scrollContainerRef}
    >
      {messages.map((msg, index) => (
        <div
          key={index}
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

  const NotesPane: React.FC<{ notes: Note | null }> = ({ notes }) => (
    <div id="notes-pane" className="tab-pane p-4 sm:p-6 space-y-6">
      {notes ? (
        <div id="notes-pane" className="tab-pane p-4 sm:p-6 space-y-6">
          <div className="mb-6">
            <h6 className="font-bold mb-2 text-slate-800 ">
              <i className="bi bi-clipboard2-pulse-fill mr-2 text-[#4152f1]"></i>
              Tashxis
            </h6>
            <p className="pl-7 text-slate-600 ">
              O&apos;tkir respirator virusli infeksiya (O&apos;RVI), astenik sindrom.
            </p>
          </div>
          <div>
            <h6 className="font-bold mb-2 text-slate-800 ">
              <i className="bi bi-list-check mr-2 text-[#4152f1]"></i>Tavsiyalar
            </h6>
            <ul className="pl-7 space-y-2">
              <li className="flex items-start gap-2">
                <i className="bi bi-check-circle-fill text-[#21C55D] mt-1"></i>
                <span>
                  Ko&apos;proq suyuqlik ichish (malinali choy, namatak damlamasi).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-check-circle-fill text-[#21C55D] mt-1"></i>
                <span>Yotoq rejimi (kamida 2-3 kun).</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-check-circle-fill text-[#21C55D] mt-1"></i>
                <span>Xonani tez-tez shamollatib turish.</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="bi bi-check-circle-fill text-[#21C55D] mt-1"></i>
                <span>Quyidagi dori-darmonlarni qabul qilish.</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-center text-slate-500 py-10">
          Shifokor hali xulosa yozmadi.
        </p>
      )}
    </div>
  );

  const PrescriptionsPane: React.FC<{ prescriptions: Prescription[] }> = ({
    prescriptions,
  }) => (
    <div id="prescriptions-pane" className="tab-pane p-4 sm:p-6">
      {prescriptions.length > 0 ? (
        <ul className="divide-y divide-slate-200">
          {prescriptions.map((p, index) => (
            <li key={index} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-800">{p.name}</p>
                <p className="text-sm text-slate-500">{p.instruction}</p>
              </div>
              <span className="text-sm font-medium text-slate-600 bg-slate-100 py-1 px-3 rounded-full">
                {p.duration}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-slate-500 py-10">
          Shifokor hali retsept yozmadi.
        </p>
      )}
    </div>
  );

  const FilesPane: React.FC<{ files: File[] }> = ({ files }) => (
    <div id="files-pane" className="tab-pane p-4 sm:p-6 space-y-3">
      {files.length > 0 ? (
        files.map((f, index) => (
          <a
            key={index}
            href="#"
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <i className="bi bi-file-earmark-zip-fill text-3xl text-[#4152f1]"></i>
            <div className="flex-grow">
              <p className="font-semibold text-slate-800">{f.name}</p>
              <p className="text-sm text-slate-500">
                {f.size} - {f.by} tomonidan
              </p>
            </div>
            <i className="bi bi-download text-slate-400"></i>
          </a>
        ))
      ) : (
        <p className="text-center text-slate-500 py-10">
          Suhbatda fayllar mavjud emas.
        </p>
      )}
    </div>
  );

  const renderChatPanel = () => {
    if (!selectedConsultation) {
      return (
        <div
          id="placeholder-panel"
          className="col-span-12 lg:col-span-8 xl:col-span-9 h-full flex flex-col items-center justify-center text-center bg-white rounded-2xl shadow-lg p-8"
        >
          <i className="bi bi-chat-dots text-7xl text-slate-300"></i>
          <h3 className="mt-4 text-xl font-bold text-slate-600">
            Konsultatsiya mavjud emas
          </h3>
          <p className="text-slate-500">
            Hozircha sizda faol yoki yakunlangan konsultatsiyalar yo&apos;q.
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
              alt=""
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
              <button
                onClick={() => handleTabChange("chat")}
                className={`tab-btn whitespace-nowrap cursor-pointer py-3 px-4 border-b-2 font-semibold flex justify-center items-center ${
                  activeTab === "chat"
                    ? "text-[#4153F1] border-[#4153F1]"
                    : "text-slate-500 border-transparent hover:text-[#4152F1] hover:border-[#4152F1]"
                }`}
              >
                <i className="bi bi-chat-dots-fill mr-2"></i>Chat
              </button>
              <button
                onClick={() => handleTabChange("notes")}
                className={`tab-btn whitespace-nowrap py-3 cursor-pointer px-4 border-b-2 font-medium flex justify-center items-center ${
                  activeTab === "notes"
                    ? "text-[#4153F1] border-[#4153F1]"
                    : "text-slate-500 border-transparent hover:text-[#4152F1] hover:border-[#4152F1]"
                }`}
              >
                <BsClipboard2PlusFill className="mr-2" />
                Shifokor xulosasi
              </button>
              <button
                onClick={() => handleTabChange("prescriptions")}
                className={`tab-btn whitespace-nowrap py-3 cursor-pointer px-4 border-b-2 font-medium flex justify-center items-center ${
                  activeTab === "prescriptions"
                    ? "text-[#4153F1] border-[#4153F1]"
                    : "text-slate-500 border-transparent hover:text-[#4152F1] hover:border-[#4152F1]"
                }`}
              >
                <BsFileEarmarkMedicalFill className="mr-2" />
                Retseptlar
              </button>
              <button
                onClick={() => handleTabChange("files")}
                className={`tab-btn whitespace-nowrap py-3 cursor-pointer px-4 border-b-2 font-medium flex justify-center items-center ${
                  activeTab === "files"
                    ? "text-[#4153F1] border-[#4153F1]"
                    : "text-slate-500 border-transparent hover:text-[#4152F1] hover:border-[#4152F1]"
                }`}
              >
                <PaperclipIcon className="mr-2" />
                Fayllar
              </button>
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
            {activeTab === "notes" && (
              <NotesPane notes={selectedConsultation.notes} />
            )}
            {activeTab === "prescriptions" && (
              <PrescriptionsPane
                prescriptions={selectedConsultation.prescriptions}
              />
            )}
            {activeTab === "files" && (
              <FilesPane files={selectedConsultation.files} />
            )}
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
                  onKeyPress={handleKeyPress}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <button className="p-2 text-slate-500 hover:text-[#4152f1]">
                    <i className="bi bi-paperclip text-xl"></i>
                  </button>
                  <button
                    id="send-btn"
                    className="ml-1 w-10 h-10 bg-[#4152f1] text-[var(--text-color)] rounded-full flex items-center justify-center hover:bg-[#4152f1]-600 transition"
                    onClick={handleSendMessage}
                  >
                    <i className="bi bi-send-fill"></i>
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
    <div>
      <main className="flex-1 overflow-hidden ">
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
    </div>
  );
};

export default ConsultationPage;
