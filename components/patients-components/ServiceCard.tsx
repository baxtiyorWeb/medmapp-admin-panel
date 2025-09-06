
"use client";

import React, { useState, useRef, Component, ReactNode } from "react";
import "./style.css";
import api from "@/utils/api";

type ServiceId = "visa" | "transfer" | "hotel" | "translator" | "simcard";

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
        <div className="text-red-600 text-center p-4">
          Xatolik yuz berdi. Iltimos, sahifani yangilang yoki administrator bilan bog'laning.
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ServiceCard() {
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
  const [simcardPassportScan, setSimcardPassportScan] = useState<File | null>(null);
  const [simcardNote, setSimcardNote] = useState("");
  const [transferFlightNumber, setTransferFlightNumber] = useState("");
  const [transferArrivalDatetime, setTransferArrivalDatetime] = useState("");
  const [transferTicketScan, setTransferTicketScan] = useState<File | null>(null);
  const [translatorLanguage, setTranslatorLanguage] = useState("");
  const [translatorRequirements, setTranslatorRequirements] = useState("");
  const [hotelNotes, setHotelNotes] = useState("");

  // Refs for file inputs
  const visaFileInputRef = useRef<HTMLInputElement | null>(null);
  const simcardFileInputRef = useRef<HTMLInputElement | null>(null);
  const transferFileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle service button clicks
  const openVisaModal = () => {
    console.log("Opening Visa Modal");
    setIsVisaModalOpen(true);
    setError(null);
    setSuccess(null);
  };
  const openSimcardModal = () => {
    console.log("Opening Simcard Modal");
    setIsSimcardModalOpen(true);
    setError(null);
    setSuccess(null);
  };
  const openTransferModal = () => {
    console.log("Opening Transfer Modal");
    setIsTransferModalOpen(true);
    setError(null);
    setSuccess(null);
  };
  const openTranslatorModal = () => {
    console.log("Opening Translator Modal");
    setIsTranslatorModalOpen(true);
    setError(null);
    setSuccess(null);
  };
  const openHotelModal = () => {
    console.log("Opening Hotel Modal");
    setIsHotelModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  console.log("Modal States:", {
    isVisaModalOpen,
    isSimcardModalOpen,
    isTransferModalOpen,
    isTranslatorModalOpen,
    isHotelModalOpen,
  });

  // Close modals and reset states
  const closeVisaModal = () => {
    setIsVisaModalOpen(false);
    setVisaPassportScan(null);
    setVisaNote("");
    if (visaFileInputRef.current) visaFileInputRef.current.value = "";
    setError(null);
    setSuccess(null);
  };
  const closeSimcardModal = () => {
    setIsSimcardModalOpen(false);
    setSimcardPassportScan(null);
    setSimcardNote("");
    if (simcardFileInputRef.current) simcardFileInputRef.current.value = "";
    setError(null);
    setSuccess(null);
  };
  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
    setTransferFlightNumber("");
    setTransferArrivalDatetime("");
    setTransferTicketScan(null);
    if (transferFileInputRef.current) transferFileInputRef.current.value = "";
    setError(null);
    setSuccess(null);
  };
  const closeTranslatorModal = () => {
    setIsTranslatorModalOpen(false);
    setTranslatorLanguage("");
    setTranslatorRequirements("");
    setError(null);
    setSuccess(null);
  };
  const closeHotelModal = () => {
    setIsHotelModalOpen(false);
    setHotelNotes("");
    setError(null);
    setSuccess(null);
  };

  // Helper to extract error messages
  const getErrorMessage = (err: any): string => {
    if (err.response?.data) {
      const data = err.response.data;
      // Handle array-based errors (e.g., { flight_number: ["error"] })
      if (typeof data === "object") {
        const errors = Object.values(data)
          .flat()
          .join("; ");
        return errors || "API xatosi: Buyurtma yuborilmadi.";
      }
      // Handle single error message (e.g., "Hech qanday fayl yuborilmadi.")
      return data.detail || data || "API xatosi: Buyurtma yuborilmadi.";
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
    const formData = new FormData();
    formData.append("passport_scan", visaPassportScan); // Changed to match server
    formData.append("note", visaNote);

    // Debug FormData contents
    console.log("Visa FormData:", {
      passport_scan: visaPassportScan?.name,
      note: visaNote,
    });

    try {
      const response = await api.post("/services/visa/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Visa API response:", response.data);
      if (response.status === 201) {
        setSuccess("Murojaatingiz yuborildi");
        setTimeout(closeVisaModal, 2000);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Visa submission error:", err);
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
    const formData = new FormData();
    formData.append("passport_scan", simcardPassportScan); // Changed to match server
    formData.append("note", simcardNote);

    // Debug FormData contents
    console.log("Simcard FormData:", {
      passport_scan: simcardPassportScan?.name,
      note: simcardNote,
    });

    try {
      const response = await api.post("/services/simcard/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Simcard API response:", response.data);
      if (response.status === 201) {
        setSuccess("Murojaatingiz yuborildi");
        setTimeout(closeSimcardModal, 2000);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Simcard submission error:", err);
    }
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferFlightNumber) {
      setError("Parvoz raqami kiritilishi shart!");
      return;
    }
    if (transferFlightNumber.length > 50 || transferFlightNumber.length < 1) {
      setError("Parvoz raqami 1-50 belgi oralig'ida bo'lishi kerak.");
      return;
    }
    if (!transferArrivalDatetime) {
      setError("Kelish vaqti kiritilishi shart!");
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append("flight_number", transferFlightNumber); // Changed to match server
    formData.append("arrival_datetime", transferArrivalDatetime); // Changed to match server
    if (transferTicketScan) formData.append("ticket_scan", transferTicketScan); // Changed to match server

    // Debug FormData contents
    console.log("Transfer FormData:", {
      flight_number: transferFlightNumber,
      arrival_datetime: transferArrivalDatetime,
      ticket_scan: transferTicketScan?.name,
    });

    try {
      const response = await api.post("/services/transfer/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Transfer API response:", response.data);
      if (response.status === 201) {
        setSuccess("Murojaatingiz yuborildi");
        setTimeout(closeTransferModal, 2000);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Transfer submission error:", err);
    }
  };

  const handleTranslatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!translatorLanguage) {
      setError("Til kiritilishi shart!");
      return;
    }
    if (translatorLanguage.length > 50 || translatorLanguage.length < 1) {
      setError("Til 1-50 belgi oralig'ida bo'lishi kerak.");
      return;
    }
    if (translatorRequirements.length > 500) {
      setError("Talablar 500 belgidan oshmasligi kerak.");
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append("language", translatorLanguage);
    formData.append("requirements", translatorRequirements);

    // Debug FormData contents
    console.log("Translator FormData:", {
      language: translatorLanguage,
      requirements: translatorRequirements,
    });

    try {
      const response = await api.post("/services/translator/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Translator API response:", response.data);
      if (response.status === 201) {
        setSuccess("Murojaatingiz yuborildi");
        setTimeout(closeTranslatorModal, 2000);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Translator submission error:", err);
    }
  };

  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hotelNotes.length > 500) {
      setError("Izoh 500 belgidan oshmasligi kerak.");
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append("notes", hotelNotes);

    // Debug FormData contents
    console.log("Hotel FormData:", { notes: hotelNotes });

    try {
      const response = await api.post("/services/hotel/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Hotel API response:", response.data);
      if (response.status === 201) {
        setSuccess("Murojaatingiz yuborildi");
        setTimeout(closeHotelModal, 2000);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      console.error("Hotel submission error:", err);
    }
  };

  return (
    <ErrorBoundary>
      <div>
        <div className="container">
          <div className="p-4">
            <h1 className="text-xl my-4 font-bold text-slate-800 dark:text-white">
              Qo'shimcha xizmatlar
            </h1>

            {showNotification && (
              <div className="notification warning flex items-center gap-2 p-4 mb-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg">
                <i className="bi bi-exclamation-triangle-fill text-2xl"></i>
                <span>Iltimos, avval asosiy anketani to'ldirib yuboring.</span>
              </div>
            )}

            {error && (
              <div className="notification error flex items-center gap-2 p-4 mb-4 bg-red-100 text-red-800 border border-yellow-300 rounded-lg">
                <i className="bi bi-exclamation-circle-fill text-2xl"></i>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="notification success flex items-center gap-2 p-4 mb-4 bg-green-100 text-green-800 border border-green-300 rounded-lg">
                <i className="bi bi-check-circle-fill text-2xl"></i>
                <span>{success}</span>
              </div>
            )}

            <div
              id="service-cards-container"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            >
              {/* Visa Card */}
              <div
                className="service-card bg-white dark:bg-slate-800 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                data-service-id="visa"
              >
                <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                  <i className="bi bi-patch-check-fill text-3xl text-primary"></i>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                  Taklifnoma & Viza
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow mb-4">
                  Klinikadan taklifnoma oling va viza masalalarida yordam so'rang.
                </p>
                <button
                  className="service-btn w-full bg-primary-50 dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
                  onClick={openVisaModal}
                >
                  Buyurtma
                </button>
              </div>

              {/* Transfer Card */}
              <div
                className="service-card bg-white dark:bg-slate-800 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                data-service-id="transfer"
              >
                <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                  <i className="bi bi-airplane text-3xl text-primary"></i>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                  Transfer Xizmati
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow mb-4">
                  Aeroportdan kutib olish va klinikaga qulay yetib borishni ta'minlang.
                </p>
                <button
                  className="service-btn w-full bg-primary-50 dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
                  onClick={openTransferModal}
                >
                  Buyurtma
                </button>
              </div>

              {/* Hotel Card */}
              <div
                className="service-card bg-white dark:bg-slate-800 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                data-service-id="hotel"
              >
                <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                  <i className="bi bi-building-check text-3xl text-primary"></i>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                  Mehmonxona
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow mb-4">
                  Klinikaga yaqin va qulay mehmonxonalardan joy band qiling.
                </p>
                <button
                  className="service-btn w-full bg-primary-50 dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
                  onClick={openHotelModal}
                >
                  Buyurtma
                </button>
              </div>

              {/* Translator Card */}
              <div
                className="service-card bg-white dark:bg-slate-800 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                data-service-id="translator"
              >
                <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                  <i className="bi bi-translate text-3xl text-primary"></i>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                  Tarjimon Xizmati
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow mb-4">
                  Davolanish jarayonida til bilan bog'liq muammolarga duch kelmang.
                </p>
                <button
                  className="service-btn w-full bg-primary-50 dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
                  onClick={openTranslatorModal}
                >
                  Buyurtma
                </button>
              </div>

              {/* SIM Card */}
              <div
                className="service-card bg-white dark:bg-slate-800 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                data-service-id="simcard"
              >
                <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mb-4">
                  <i className="bi bi-sim text-3xl text-primary"></i>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">
                  SIM-karta
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow mb-4">
                  Borgan davlatingizda yaqinlaringiz bilan aloqada bo'ling.
                </p>
                <button
                  className="service-btn w-full bg-primary-50 dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
                  onClick={openSimcardModal}
                >
                  Buyurtma
                </button>
              </div>
            </div>

            {/* Visa Modal */}
            {isVisaModalOpen && (
              <div
                id="visa-modal"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
              >
                <div className="modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                  <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      Taklifnoma & Viza
                    </h3>
                    <button
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      onClick={closeVisaModal}
                    >
                      <i className="bi bi-x-lg text-xl"></i>
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                    <form id="visa-form" onSubmit={handleVisaSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="visa-passport-scan"
                            className="relative block w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-primary dark:hover:border-primary-400 transition-colors bg-slate-50 dark:bg-slate-700/50"
                          >
                            <i className="bi bi-cloud-arrow-up-fill text-3xl text-primary"></i>
                            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setVisaPassportScan(file);
                              console.log("Visa file selected:", file?.name);
                            }}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="visa-note"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
                          >
                            Qo'shimcha izoh
                          </label>
                          <textarea
                            id="visa-note"
                            placeholder="Izoh (maksimum 500 belgi)"
                            rows={3}
                            maxLength={500}
                            value={visaNote}
                            onChange={(e) => setVisaNote(e.target.value)}
                            className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                          />
                        </div>
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                        {success && <div className="text-green-600 text-sm">{success}</div>}
                        <div className="flex items-center justify-end space-x-3 mt-4">
                          <button
                            type="button"
                            className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                            onClick={closeVisaModal}
                          >
                            Bekor qilish
                          </button>
                          <button
                            type="submit"
                            className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-700 transition"
                          >
                            Buyurtma qilish
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Simcard Modal */}
            {isSimcardModalOpen && (
              <div
                id="simcard-modal"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
              >
                <div className="modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                  <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      SIM-karta
                    </h3>
                    <button
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      onClick={closeSimcardModal}
                    >
                      <i className="bi bi-x-lg text-xl"></i>
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                    <form id="simcard-form" onSubmit={handleSimcardSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="simcard-passport-scan"
                            className="relative block w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-primary dark:hover:border-primary-400 transition-colors bg-slate-50 dark:bg-slate-700/50"
                          >
                            <i className="bi bi-cloud-arrow-up-fill text-3xl text-primary"></i>
                            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Passport skanini yuklash *
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
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setSimcardPassportScan(file);
                              console.log("Simcard file selected:", file?.name);
                            }}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="simcard-note"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
                          >
                            Qo'shimcha izoh
                          </label>
                          <textarea
                            id="simcard-note"
                            placeholder="Izoh (maksimum 500 belgi)"
                            rows={3}
                            maxLength={500}
                            value={simcardNote}
                            onChange={(e) => setSimcardNote(e.target.value)}
                            className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                          />
                        </div>
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                        {success && <div className="text-green-600 text-sm">{success}</div>}
                        <div className="flex items-center justify-end space-x-3 mt-4">
                          <button
                            type="button"
                            className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                            onClick={closeSimcardModal}
                          >
                            Bekor qilish
                          </button>
                          <button
                            type="submit"
                            className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-700 transition"
                          >
                            Buyurtma qilish
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Modal */}
            {isTransferModalOpen && (
              <div
                id="transfer-modal"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
              >
                <div className="modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                  <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      Transfer Xizmati
                    </h3>
                    <button
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      onClick={closeTransferModal}
                    >
                      <i className="bi bi-x-lg text-xl"></i>
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                    <form id="transfer-form" onSubmit={handleTransferSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="transfer-flight-number"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
                          >
                            Parvoz raqami *
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
                            className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="transfer-arrival-datetime"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
                          >
                            Kelish vaqti *
                          </label>
                          <input
                            id="transfer-arrival-datetime"
                            type="datetime-local"
                            required
                            value={transferArrivalDatetime}
                            onChange={(e) => setTransferArrivalDatetime(e.target.value)}
                            className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="transfer-ticket-scan"
                            className="relative block w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-primary dark:hover:border-primary-400 transition-colors bg-slate-50 dark:bg-slate-700/50"
                          >
                            <i className="bi bi-cloud-arrow-up-fill text-3xl text-primary"></i>
                            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              Chipta skanini yuklash (ixtiyoriy)
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
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              setTransferTicketScan(file);
                              console.log("Transfer file selected:", file?.name);
                            }}
                          />
                        </div>
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                        {success && <div className="text-green-600 text-sm">{success}</div>}
                        <div className="flex items-center justify-end space-x-3 mt-4">
                          <button
                            type="button"
                            className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                            onClick={closeTransferModal}
                          >
                            Bekor qilish
                          </button>
                          <button
                            type="submit"
                            className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-700 transition"
                          >
                            Buyurtma qilish
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Translator Modal */}
            {isTranslatorModalOpen && (
              <div
                id="translator-modal"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
              >
                <div className="modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                  <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      Tarjimon Xizmati
                    </h3>
                    <button
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      onClick={closeTranslatorModal}
                    >
                      <i className="bi bi-x-lg text-xl"></i>
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                    <form id="translator-form" onSubmit={handleTranslatorSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="translator-language"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
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
                            className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="translator-requirements"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
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
                            className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                          />
                        </div>
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                        {success && <div className="text-green-600 text-sm">{success}</div>}
                        <div className="flex items-center justify-end space-x-3 mt-4">
                          <button
                            type="button"
                            className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                            onClick={closeTranslatorModal}
                          >
                            Bekor qilish
                          </button>
                          <button
                            type="submit"
                            className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-700 transition"
                          >
                            Buyurtma qilish
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Hotel Modal */}
            {isHotelModalOpen && (
              <div
                id="hotel-modal"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
              >
                <div className="modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
                  <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      Mehmonxona
                    </h3>
                    <button
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      onClick={closeHotelModal}
                    >
                      <i className="bi bi-x-lg text-xl"></i>
                    </button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                    <form id="hotel-form" onSubmit={handleHotelSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="hotel-notes"
                            className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
                          >
                            Qo'shimcha izoh
                          </label>
                          <textarea
                            id="hotel-notes"
                            placeholder="Masalan, mehmonxona turi yoki qo'shimcha xizmatlar"
                            rows={3}
                            maxLength={500}
                            value={hotelNotes}
                            onChange={(e) => setHotelNotes(e.target.value)}
                            className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                          />
                        </div>
                        {error && <div className="text-red-600 text-sm">{error}</div>}
                        {success && <div className="text-green-600 text-sm">{success}</div>}
                        <div className="flex items-center justify-end space-x-3 mt-4">
                          <button
                            type="button"
                            className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                            onClick={closeHotelModal}
                          >
                            Bekor qilish
                          </button>
                          <button
                            type="submit"
                            className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-700 transition"
                          >
                            Buyurtma qilish
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}