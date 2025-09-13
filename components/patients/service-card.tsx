"use client";

import React, { useState, useRef } from "react";

import "./style.css";

import api from "@/utils/api";

import { AxiosError } from "axios";
import ServiceCardItem from "./modals/service-card-item";
import VisaModal from "./modals/visa-modal";
import SimcardModal from "./modals/simcard-modal";
import TransferModal from "./modals/transfer-modal";
import TranslatorModal from "./modals/translator-modal";
import HotelModal from "./modals/hotel-modal";
import { ErrorBoundary } from "@/utils/error-boundary";
import Notification from "./notification-modal";

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
            translatorLanguage={translatorLanguage}
            setTranslatorLanguage={setTranslatorLanguage}
            translatorRequirements={translatorRequirements}
            setTranslatorRequirements={setTranslatorRequirements}
            handleSubmit={handleTranslatorSubmit}
          />
          <HotelModal
            isOpen={isHotelModalOpen}
            onClose={closeHotelModal}
            hotelNotes={hotelNotes}
            setHotelNotes={setHotelNotes}
            handleSubmit={handleHotelSubmit}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
