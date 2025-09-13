"use client";

import React, { useState, useRef, Component, ReactNode, Fragment } from "react";

import "./style.css";

import api from "@/utils/api";

import { AxiosError } from "axios";

import { Dialog, Transition } from "@headlessui/react";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 dark:text-red-400 text-center p-4">
          Xatolik yuz berdi. Iltimos, sahifani yangilang yoki administrator
          bilan bog&apos;laning.
        </div>
      );
    }
    return this.props.children;
  }
}

function Notification({ type, message }: { type: string; message: ReactNode }) {
  let bgClass, textClass, borderClass, icon;
  switch (type) {
    case "warning":
      bgClass = "bg-yellow-100 dark:bg-yellow-900";
      textClass = "text-yellow-700 dark:text-yellow-200";
      borderClass = "border-yellow-300 dark:border-yellow-700";
      icon = "bi-exclamation-triangle-fill";
      break;
    case "error":
      bgClass = "bg-red-100 dark:bg-red-900";
      textClass = "text-red-700 dark:text-red-200";
      borderClass = "border-red-300 dark:border-red-700";
      icon = "bi-exclamation-circle-fill";
      break;
    case "success":
      bgClass = "bg-green-100 dark:bg-green-900";
      textClass = "text-green-700 dark:text-green-200";
      borderClass = "border-green-300 dark:border-green-700";
      icon = "bi-check-circle-fill";
      break;
    default:
      return null;
  }
  return (
    <div
      className={`notification ${type} flex items-center gap-2 p-4 mb-4 ${bgClass} ${textClass} border ${borderClass} rounded-lg`}
    >
      <i className={`bi ${icon} text-2xl`}></i>
      <span>{message}</span>
    </div>
  );
}

// Reusable ServiceCardItem Component
function ServiceCardItem({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <div className="service-card bg-[var(--card-background)] rounded-2xl p-5 text-center flex flex-col items-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[var(--border-color)]">
      <div className="w-16 h-16 rounded-full bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/50 flex items-center justify-center mb-4">
        <i className={`bi ${icon} text-3xl text-[var(--color-primary)]`}></i>
      </div>
      <h4 className="font-bold text-[var(--text-color)] mb-1">{title}</h4>
      <p className="text-xs text-[var(--text-light)] flex-grow mb-4">
        {description}
      </p>
      <button
        className="service-btn w-full bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-800)]/50 text-[var(--color-primary-600)] dark:text-[var(--color-primary-200)] font-semibold py-2 px-4 rounded-lg text-sm hover:bg-[var(--color-primary-100)] dark:hover:bg-[var(--color-primary-700)] transition cursor-pointer"
        onClick={onClick}
      >
        Buyurtma qilish
      </button>
    </div>
  );
}

// Reusable Modal Component (base for all modals)
function BaseModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-[var(--card-background)] rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col border border-[var(--border-color)]">
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
                <Dialog.Title className="text-lg font-bold text-[var(--text-color)]">
                  {title}
                </Dialog.Title>
                <button
                  className="text-slate-400 hover:text-slate-600 transition"
                  onClick={onClose}
                >
                  <i className="bi bi-x-lg text-xl cursor-pointer"></i>
                </button>
              </div>
              <div className="p-6 overflow-y-auto">{children}</div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}

// Visa Modal Component
function VisaModal({
  isOpen,
  onClose,
  error,
  success,
  visaPassportScan,
  setVisaPassportScan,
  visaNote,
  setVisaNote,
  visaFileInputRef,
  handleSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  error: string | null;
  success: string | null;
  visaPassportScan: File | null;
  setVisaPassportScan: React.Dispatch<React.SetStateAction<File | null>>;
  visaNote: string;
  setVisaNote: React.Dispatch<React.SetStateAction<string>>;
  visaFileInputRef: React.RefObject<HTMLInputElement | null>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Taklifnoma & Viza">
      <form id="visa-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="visa-passport-scan"
              className="relative block w-full border-2 border-dashed border-[var(--border-color)] rounded-xl p-4 text-center cursor-pointer hover:border-slate-500 transition-colors bg-[var(--input-bg)]"
            >
              <i className="bi bi-cloud-arrow-up-fill text-3xl text-[#4338CA]"></i>
              <p className="mt-1 text-sm font-semibold text-[var(--text-color)]">
                Passport skanini yuklash *
              </p>
              {visaPassportScan && (
                <p className="text-sm text-slate-500">
                  Yuklangan: {visaPassportScan.name}
                </p>
              )}
            </label>
            <input
              id="visa-passport-scan"
              type="file"
              className="hidden"
              required
              ref={visaFileInputRef}
              onChange={(e) => setVisaPassportScan(e.target.files?.[0] || null)}
            />
          </div>
          <div>
            <label
              htmlFor="visa-note"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Qo&apos;shimcha izoh
            </label>
            <textarea
              id="visa-note"
              placeholder="Izoh (maksimum 500 belgi)"
              rows={3}
              maxLength={500}
              value={visaNote}
              onChange={(e) => setVisaNote(e.target.value)}
              className="w-full p-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              className="bg-[#475569] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#64748B] transition cursor-pointer"
              onClick={onClose}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="bg-[#4154F1] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#4338CA] transition cursor-pointer"
            >
              Buyurtma qilish
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

// Simcard Modal Component
function SimcardModal({
  isOpen,
  onClose,
  error,
  success,
  simcardPassportScan,
  setSimcardPassportScan,
  simcardNote,
  setSimcardNote,
  simcardFileInputRef,
  handleSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  error: string | null;
  success: string | null;
  simcardPassportScan: File | null;
  setSimcardPassportScan: React.Dispatch<React.SetStateAction<File | null>>;
  simcardNote: string;
  setSimcardNote: React.Dispatch<React.SetStateAction<string>>;
  simcardFileInputRef: React.RefObject<HTMLInputElement | null>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="SIM-karta">
      <form id="simcard-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="simcard-passport-scan"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Passport skanini yuklash <span className="">*</span>
            </label>
            <label
              htmlFor="simcard-passport-scan"
              className="relative block w-full border-2 border-dashed border-[var(--border-color)] rounded-xl p-4 text-center cursor-pointer hover:border-[#4338CA] transition-colors bg-[var(--card-background)]"
            >
              <i className="bi bi-cloud-arrow-up-fill text-3xl text-[#4338CA]"></i>
              <p className="mt-1 text-sm font-semibold text-[var(--text-color)]">
                Fayl yuklash
              </p>
              {simcardPassportScan && (
                <p className="text-sm text-slate-500">
                  Yuklangan: {simcardPassportScan.name}
                </p>
              )}
            </label>
            <input
              id="simcard-passport-scan"
              type="file"
              className="hidden"
              required
              ref={simcardFileInputRef}
              onChange={(e) =>
                setSimcardPassportScan(e.target.files?.[0] || null)
              }
            />
          </div>
          <div>
            <label
              htmlFor="simcard-note"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Qo&apos;shimcha izoh
            </label>
            <textarea
              id="simcard-note"
              placeholder="Izoh (maksimum 500 belgi)"
              rows={3}
              maxLength={500}
              value={simcardNote}
              onChange={(e) => setSimcardNote(e.target.value)}
              className="w-full p-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              className="bg-[#475569] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#64748B] transition cursor-pointer"
              onClick={onClose}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="bg-[#4154F1] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#4338CA] transition cursor-pointer"
            >
              Buyurtma qilish
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

// Transfer Modal Component
function TransferModal({
  isOpen,
  onClose,
  error,
  success,
  transferFlightNumber,
  setTransferFlightNumber,
  transferArrivalDatetime,
  setTransferArrivalDatetime,
  transferTicketScan,
  setTransferTicketScan,
  transferFileInputRef,
  handleSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  error: string | null;
  success: string | null;
  transferFlightNumber: string;
  setTransferFlightNumber: React.Dispatch<React.SetStateAction<string>>;
  transferArrivalDatetime: string;
  setTransferArrivalDatetime: React.Dispatch<React.SetStateAction<string>>;
  transferTicketScan: File | null;
  setTransferTicketScan: React.Dispatch<React.SetStateAction<File | null>>;
  transferFileInputRef: React.RefObject<HTMLInputElement | null>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Transfer Xizmati">
      <form id="transfer-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="transfer-flight-number"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Reys raqami <span className="">*</span>
            </label>
            <input
              id="transfer-flight-number"
              type="text"
              placeholder="Parvoz raqami (masalan, TK123)"
              maxLength={50}
              minLength={1}
              required
              value={transferFlightNumber}
              onChange={(e) => setTransferFlightNumber(e.target.value)}
              className="w-full p-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition"
            />
          </div>
          <div>
            <label
              htmlFor="transfer-arrival-datetime"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Kelish vaqti <span className="">*</span>
            </label>
            <input
              id="transfer-arrival-datetime"
              type="datetime-local"
              required
              value={transferArrivalDatetime}
              onChange={(e) => setTransferArrivalDatetime(e.target.value)}
              className="w-full p-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-color)] mb-1 block">
              Chipta skanini yuklash (ixtiyoriy)
            </label>
            <label
              htmlFor="transfer-ticket-scan"
              className="relative block w-full border-2 border-dashed border-[var(--border-color)] rounded-xl p-4 text-center cursor-pointer hover:border-[#4338CA] transition-colors bg-[var(--card-background)]"
            >
              <i className="bi bi-cloud-arrow-up-fill text-3xl text-[#4338CA]"></i>
              <p className="mt-1 text-sm font-semibold text-[var(--text-color)]">
                Fayl yuklash
              </p>
              {transferTicketScan && (
                <p className="text-sm text-slate-500">
                  Yuklangan: {transferTicketScan.name}
                </p>
              )}
            </label>
            <input
              id="transfer-ticket-scan"
              type="file"
              className="hidden"
              ref={transferFileInputRef}
              onChange={(e) =>
                setTransferTicketScan(e.target.files?.[0] || null)
              }
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              className="bg-[#475569] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#64748B] transition cursor-pointer"
              onClick={onClose}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="bg-[#4154F1] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#4338CA] transition cursor-pointer"
            >
              Buyurtma qilish
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

// Translator Modal Component
function TranslatorModal({
  isOpen,
  onClose,
  error,
  success,
  translatorLanguage,
  setTranslatorLanguage,
  translatorRequirements,
  setTranslatorRequirements,
  handleSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  error: string | null;
  success: string | null;
  translatorLanguage: string;
  setTranslatorLanguage: React.Dispatch<React.SetStateAction<string>>;
  translatorRequirements: string;
  setTranslatorRequirements: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Tarjimon Xizmati">
      <form id="translator-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="translator-language"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Til *
            </label>
            <input
              id="translator-language"
              type="text"
              placeholder="Masalan, Ingliz tili"
              maxLength={50}
              minLength={1}
              required
              value={translatorLanguage}
              onChange={(e) => setTranslatorLanguage(e.target.value)}
              className="w-full p-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition"
            />
          </div>
          <div>
            <label
              htmlFor="translator-requirements"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Talablar
            </label>
            <textarea
              id="translator-requirements"
              placeholder="Maxsus talablar (ixtiyoriy)"
              rows={3}
              maxLength={500}
              value={translatorRequirements}
              onChange={(e) => setTranslatorRequirements(e.target.value)}
              className="w-full p-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              className="bg-[#475569] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#64748B] transition cursor-pointer"
              onClick={onClose}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="bg-[#4154F1] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#4338CA] transition cursor-pointer"
            >
              Buyurtma qilish
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

// Hotel Modal Component
function HotelModal({
  isOpen,
  onClose,
  error,
  success,
  hotelNotes,
  setHotelNotes,
  handleSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  error: string | null;
  success: string | null;
  hotelNotes: string;
  setHotelNotes: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Mehmonxona">
      <form id="hotel-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="hotel-notes"
              className="text-sm font-medium text-[var(--text-color)] mb-1 block"
            >
              Qo&apos;shimcha izoh
            </label>
            <textarea
              id="hotel-notes"
              placeholder="Masalan, mehmonxona turi yoki qo'shimcha xizmatlar"
              rows={3}
              maxLength={500}
              value={hotelNotes}
              onChange={(e) => setHotelNotes(e.target.value)}
              className="w-full p-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-slate-500 outline-none transition"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              className="bg-[#475569] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#64748B] transition cursor-pointer"
              onClick={onClose}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="bg-[#4154F1] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#4338CA] transition cursor-pointer"
            >
              Buyurtma qilish
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  );
}

// Main ServiceCard Component (manages state and logic)
export default function Services() {
  const [showNotification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for modals
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [isSimcardModalOpen, setIsSimcardModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isTranslatorModalOpen, setIsTranslatorModalOpen] = useState(false);
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);

  // State for form fields
  const [visaPassportScan, setVisaPassportScan] = useState<File | null>(null);
  const [visaNote, setVisaNote] = useState("");
  const [simcardPassportScan, setSimcardPassportScan] = useState<File | null>(
    null
  );
  const [simcardNote, setSimcardNote] = useState("");
  const [transferFlightNumber, setTransferFlightNumber] = useState("");
  const [transferArrivalDatetime, setTransferArrivalDatetime] = useState("");
  const [transferTicketScan, setTransferTicketScan] = useState<File | null>(
    null
  );
  const [translatorLanguage, setTranslatorLanguage] = useState("");
  const [translatorRequirements, setTranslatorRequirements] = useState("");
  const [hotelNotes, setHotelNotes] = useState("");

  // Refs for file inputs
  const visaFileInputRef = useRef<HTMLInputElement | null>(null);
  const simcardFileInputRef = useRef<HTMLInputElement | null>(null);
  const transferFileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper function to open modals and clear previous messages
  const openModal = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setError(null);
    setSuccess(null);
    setter(true);
  };

  // Close modals and reset states
  const closeVisaModal = () => {
    setIsVisaModalOpen(false);
    setTimeout(() => {
      setVisaPassportScan(null);
      setVisaNote("");
      if (visaFileInputRef.current) visaFileInputRef.current.value = "";
    }, 300); // Delay reset until after close animation
  };
  const closeSimcardModal = () => {
    setIsSimcardModalOpen(false);
    setTimeout(() => {
      setSimcardPassportScan(null);
      setSimcardNote("");
      if (simcardFileInputRef.current) simcardFileInputRef.current.value = "";
    }, 300);
  };
  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
    setTimeout(() => {
      setTransferFlightNumber("");
      setTransferArrivalDatetime("");
      setTransferTicketScan(null);
      if (transferFileInputRef.current) transferFileInputRef.current.value = "";
    }, 300);
  };
  const closeTranslatorModal = () => {
    setIsTranslatorModalOpen(false);
    setTimeout(() => {
      setTranslatorLanguage("");
      setTranslatorRequirements("");
    }, 300);
  };
  const closeHotelModal = () => {
    setIsHotelModalOpen(false);
    setTimeout(() => {
      setHotelNotes("");
    }, 300);
  };

  // Helper to extract error messages
  const getErrorMessage = (err: unknown): string => {
    if ((err as AxiosError)?.response?.data) {
      const data = (err as AxiosError).response?.data;
      if (typeof data === "object" && data !== null) {
        const errors = Object.values(data as Record<string, string[] | string>)
          .flatMap((v) => (Array.isArray(v) ? v : [v]))
          .join("; ");
        return errors || "API xatosi: Buyurtma yuborilmadi.";
      }
      return (
        (data as { detail?: string })?.detail ||
        String(data) ||
        "API xatosi: Buyurtma yuborilmadi."
      );
    }
    return "API xatosi: Buyurtma yuborilmadi.";
  };

  // Handle form submissions with Axios
  const handleVisaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visaPassportScan) {
      setError("Passport skanini yuklash shart!");
      return;
    }
    if (visaNote.length > 500) {
      setError("Izoh 500 belgidan oshmasligi kerak.");
      return;
    }

    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append("passport_scan", visaPassportScan);
    formData.append("note", visaNote);

    try {
      const response = await api.post("/services/visa/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        setSuccess("Taklifnoma & Visa buyurtma qilindi");
        setTimeout(closeVisaModal, 2000);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
  };

  const handleSimcardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simcardPassportScan) {
      setError("Passport skanini yuklash shart!");
      return;
    }
    if (simcardNote.length > 500) {
      setError("Izoh 500 belgidan oshmasligi kerak.");
      return;
    }

    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append("passport_scan", simcardPassportScan);
    formData.append("note", simcardNote);

    try {
      const response = await api.post("/services/simcard/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        setSuccess("SIM-karta buyurtma qilindi ");
        setTimeout(closeSimcardModal, 2000);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferFlightNumber) {
      setError("Parvoz raqami kiritilishi shart!");
      return;
    }
    if (transferFlightNumber.length > 50 || transferFlightNumber.length < 1) {
      setError("Parvoz raqami 1-50 belgi oralig'ida bo&apos;lishi kerak.");
      return;
    }
    if (!transferArrivalDatetime) {
      setError("Kelish vaqti kiritilishi shart!");
      return;
    }

    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append("flight_number", transferFlightNumber);
    formData.append("arrival_datetime", transferArrivalDatetime);
    if (transferTicketScan) formData.append("ticket_scan", transferTicketScan);

    try {
      const response = await api.post("/services/transfer/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        setSuccess("Transfer xizmati buyurtma qilindi ");
        setTimeout(closeTransferModal, 2000);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
  };

  const handleTranslatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!translatorLanguage) {
      setError("Til kiritilishi shart!");
      return;
    }
    if (translatorLanguage.length > 50 || translatorLanguage.length < 1) {
      setError("Til 1-50 belgi oralig'ida bo&apos;lishi kerak.");
      return;
    }
    if (translatorRequirements.length > 500) {
      setError("Talablar 500 belgidan oshmasligi kerak.");
      return;
    }

    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append("language", translatorLanguage);
    formData.append("requirements", translatorRequirements);

    try {
      const response = await api.post("/services/translator/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        setSuccess("Tarjimon xizmati buyurtma qilindi");
        setTimeout(closeTranslatorModal, 2000);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
  };

  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hotelNotes.length > 500) {
      setError("Izoh 500 belgidan oshmasligi kerak.");
      return;
    }

    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append("notes", hotelNotes);

    try {
      const response = await api.post("/services/hotel/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        setSuccess("Mehmonxona buyurtma qilindi");
        setTimeout(closeHotelModal, 2000);
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
  };

  return (
    <ErrorBoundary>
      <div className="w-full">
        <div>
          {/* Main Title */}
          <h1 className="text-xl my-4 font-bold text-[var(--text-color)]">
            Qo&apos;shimcha xizmatlar
          </h1>

          {/* Notifications */}
          {showNotification && (
            <Notification
              type="warning"
              message="Iltimos, avval asosiy anketani to'ldirib yuboring."
            />
          )}
          {error && <Notification type="error" message={error} />}
          {success && <Notification type="success" message={success} />}

          {/* Service Cards Grid */}
          <div
            id="service-cards-container"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pt-8"
          >
            <ServiceCardItem
              icon="bi-patch-check-fill"
              title="Taklifnoma & Viza"
              description="Klinikadan taklifnoma oling va viza masalalarida yordam so'rang."
              onClick={() => openModal(setIsVisaModalOpen)}
            />
            <ServiceCardItem
              icon="bi-airplane"
              title="Transfer xizmati"
              description="Aeroportdan kutib olish va klinikaga qulay yetib borishni ta'minlang."
              onClick={() => openModal(setIsTransferModalOpen)}
            />
            <ServiceCardItem
              icon="bi-building-check"
              title="Mehmonxona"
              description="Klinikaga yaqin va qulay mehmonxonalardan joy band qiling."
              onClick={() => openModal(setIsHotelModalOpen)}
            />
            <ServiceCardItem
              icon="bi-translate"
              title="Tarjimon xizmati"
              description="Davolanish jarayonida til bilan bog'liq muammolarga duch kelmang."
              onClick={() => openModal(setIsTranslatorModalOpen)}
            />
            <ServiceCardItem
              icon="bi-sim"
              title="SIM-karta"
              description="Borgan davlatingizda yaqinlaringiz bilan aloqada bo'ling."
              onClick={() => openModal(setIsSimcardModalOpen)}
            />
          </div>

          {/* Modals */}
          <VisaModal
            isOpen={isVisaModalOpen}
            onClose={closeVisaModal}
            error={error}
            success={success}
            visaPassportScan={visaPassportScan}
            setVisaPassportScan={setVisaPassportScan}
            visaNote={visaNote}
            setVisaNote={setVisaNote}
            visaFileInputRef={visaFileInputRef}
            handleSubmit={handleVisaSubmit}
          />
          <SimcardModal
            isOpen={isSimcardModalOpen}
            onClose={closeSimcardModal}
            error={error}
            success={success}
            simcardPassportScan={simcardPassportScan}
            setSimcardPassportScan={setSimcardPassportScan}
            simcardNote={simcardNote}
            setSimcardNote={setSimcardNote}
            simcardFileInputRef={simcardFileInputRef}
            handleSubmit={handleSimcardSubmit}
          />
          <TransferModal
            isOpen={isTransferModalOpen}
            onClose={closeTransferModal}
            error={error}
            success={success}
            transferFlightNumber={transferFlightNumber}
            setTransferFlightNumber={setTransferFlightNumber}
            transferArrivalDatetime={transferArrivalDatetime}
            setTransferArrivalDatetime={setTransferArrivalDatetime}
            transferTicketScan={transferTicketScan}
            setTransferTicketScan={setTransferTicketScan}
            transferFileInputRef={transferFileInputRef}
            handleSubmit={handleTransferSubmit}
          />
          <TranslatorModal
            isOpen={isTranslatorModalOpen}
            onClose={closeTranslatorModal}
            error={error}
            success={success}
            translatorLanguage={translatorLanguage}
            setTranslatorLanguage={setTranslatorLanguage}
            translatorRequirements={translatorRequirements}
            setTranslatorRequirements={setTranslatorRequirements}
            handleSubmit={handleTranslatorSubmit}
          />
          <HotelModal
            isOpen={isHotelModalOpen}
            onClose={closeHotelModal}
            error={error}
            success={success}
            hotelNotes={hotelNotes}
            setHotelNotes={setHotelNotes}
            handleSubmit={handleHotelSubmit}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
