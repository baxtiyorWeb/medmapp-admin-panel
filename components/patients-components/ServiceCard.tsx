"use client";
import React, { JSX, useState } from "react";
import api from "@/utils/api";

type ServiceId = "visa" | "transfer" | "hotel" | "translator" | "simcard";

interface ModalContent {
  title: string;
  body: JSX.Element;
}

const ServiceCard: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceId | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate formData in localStorage
  const isFormDataValid = (): boolean => {
    try {
      const data = JSON.parse(localStorage.getItem("formData") || "{}");
      console.log("Checking formData:", data);
      return data.formData && data.currentStep && data.currentStep >= 4;
    } catch (error) {
      console.error("Error parsing formData from localStorage:", error);
      return false;
    }
  };

  // Handle service button click
  const handleServiceButtonClick = (serviceId: ServiceId): void => {
    console.log("Service button clicked:", serviceId);
    if (!isFormDataValid()) {
      console.log("Form data invalid, showing notification");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } else {
      console.log("Form data valid, opening modal for:", serviceId);
      setSelectedService(serviceId);
      setIsModalOpen(true);
      setError(null);
    }
  };

  // Close modal and reset form
  const closeModal = (): void => {
    console.log("Closing modal");
    setIsModalOpen(false);
    setSelectedService(null);
    setError(null);
    const form = document.getElementById(
      "service-form"
    ) as HTMLFormElement | null;
    form?.reset();
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!selectedService) {
      console.error("No service selected");
      setError("Xizmat tanlanmadi.");
      return;
    }

    const formData = new FormData();
    let url = "";
    let isMultipart = true;
    let payload:
      | FormData
      | { data: { language: string; requirements: string } } = formData;

    try {
      switch (selectedService) {
        case "visa": {
          url = "/services/visa/";
          const passportScan = (
            document.getElementById("visa-passport-scan") as HTMLInputElement
          )?.files?.[0];
          const note =
            (document.getElementById("visa-note") as HTMLTextAreaElement)
              ?.value || "";
          if (!passportScan) {
            setError("Passport skanini yuklash shart!");
            return;
          }
          if (note.length > 500) {
            setError("Izoh 500 belgidan oshmasligi kerak.");
            return;
          }
          formData.append("passport_scan", passportScan);
          formData.append("note", note);
          break;
        }
        case "simcard": {
          url = "/services/simcard/";
          const passportScan = (
            document.getElementById("simcard-passport-scan") as HTMLInputElement
          )?.files?.[0];
          const note =
            (document.getElementById("simcard-note") as HTMLTextAreaElement)
              ?.value || "";
          if (!passportScan) {
            setError("Passport skanini yuklash shart!");
            return;
          }
          if (note.length > 500) {
            setError("Izoh 500 belgidan oshmasligi kerak.");
            return;
          }
          formData.append("passport_scan", passportScan);
          formData.append("note", note);
          break;
        }
        case "transfer": {
          url = "/services/transfer/";
          const flightNumber =
            (
              document.getElementById(
                "transfer-flight-number"
              ) as HTMLInputElement
            )?.value || "";
          const arrivalDatetime =
            (
              document.getElementById(
                "transfer-arrival-datetime"
              ) as HTMLInputElement
            )?.value || "";
          const ticketScan = (
            document.getElementById("transfer-ticket-scan") as HTMLInputElement
          )?.files?.[0];
          if (!flightNumber) {
            setError("Parvoz raqami kiritilishi shart!");
            return;
          }
          if (flightNumber.length > 50 || flightNumber.length < 1) {
            setError("Parvoz raqami 1-50 belgi oralig'ida bo'lishi kerak.");
            return;
          }
          if (!arrivalDatetime) {
            setError("Kelish vaqti kiritilishi shart!");
            return;
          }
          formData.append("flight_number", flightNumber);
          formData.append("arrival_datetime", arrivalDatetime);
          if (ticketScan) formData.append("ticket_scan", ticketScan);
          break;
        }
        case "translator": {
          url = "/services/translator/";
          isMultipart = false;
          const language =
            (document.getElementById("translator-language") as HTMLInputElement)
              ?.value || "";
          const requirements =
            (
              document.getElementById(
                "translator-requirements"
              ) as HTMLTextAreaElement
            )?.value || "";
          if (!language) {
            setError("Til kiritilishi shart!");
            return;
          }
          if (language.length > 50 || language.length < 1) {
            setError("Til 1-50 belgi oralig'ida bo'lishi kerak.");
            return;
          }
          payload = { data: { language, requirements } };
          break;
        }
        case "hotel": {
          const notes =
            (document.getElementById("hotel-notes") as HTMLTextAreaElement)
              ?.value || "";
          if (notes.length > 500) {
            setError("Izoh 500 belgidan oshmasligi kerak.");
            return;
          }
          const data = JSON.parse(localStorage.getItem("formData") || "{}");
          data.formData = data.formData || { orderedServices: [] };
          data.formData.orderedServices = data.formData.orderedServices || [];
          data.formData.orderedServices.push({
            serviceId: selectedService,
            notes,
          });
          localStorage.setItem("formData", JSON.stringify(data));
          console.log("Hotel order stored locally:", {
            serviceId: selectedService,
            notes,
          });
          closeModal();
          return;
        }
        default:
          setError("Noma'lum xizmat.");
          return;
      }

      console.log(`Submitting to ${url} with data:`, payload);
      const response = await api.post(url, payload, {
        headers: isMultipart
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
      });
      console.log("API response:", response.data);
      closeModal();
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setError(
        error.response?.data?.message ||
          "Xizmatni buyurtma qilishda xatolik yuz berdi."
      );
    }
  };

  // Modal content for each service
  const modalContent: Record<ServiceId, ModalContent> = {
    visa: {
      title: "Taklifnoma & Viza",
      body: (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="visa-passport-scan"
              className="relative block w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-[rgb(79_70_229)] dark:hover:border-primary-400 transition-colors bg-slate-50 dark:bg-slate-700/50"
            >
              <i className="bi bi-cloud-arrow-up-fill text-3xl text-[rgb(79_70_229)]"></i>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Passport skanini yuklash *
              </p>
            </label>
            <input
              id="visa-passport-scan"
              type="file"
              className="hidden"
              required
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
              className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
            ></textarea>
          </div>
        </div>
      ),
    },
    simcard: {
      title: "SIM-karta",
      body: (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="simcard-passport-scan"
              className="relative block w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-[rgb(79_70_229)] dark:hover:border-primary-400 transition-colors bg-slate-50 dark:bg-slate-700/50"
            >
              <i className="bi bi-cloud-arrow-up-fill text-3xl text-[rgb(79_70_229)]"></i>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Passport skanini yuklash *
              </p>
            </label>
            <input
              id="simcard-passport-scan"
              type="file"
              className="hidden"
              required
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
              className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
            ></textarea>
          </div>
        </div>
      ),
    },
    transfer: {
      title: "Transfer Xizmati",
      body: (
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
              className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
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
              className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
            />
          </div>
          <div>
            <label
              htmlFor="transfer-ticket-scan"
              className="relative block w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-[rgb(79_70_229)] dark:hover:border-primary-400 transition-colors bg-slate-50 dark:bg-slate-700/50"
            >
              <i className="bi bi-cloud-arrow-up-fill text-3xl text-[rgb(79_70_229)]"></i>
              <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Chipta skanini yuklash (ixtiyoriy)
              </p>
            </label>
            <input id="transfer-ticket-scan" type="file" className="hidden" />
          </div>
        </div>
      ),
    },
    translator: {
      title: "Tarjimon Xizmati",
      body: (
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
              className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
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
              className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
            ></textarea>
          </div>
        </div>
      ),
    },
    hotel: {
      title: "Mehmonxona",
      body: (
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
              placeholder="Masalan, mehmonxona turi yoki qo‘shimcha xizmatlar"
              rows={3}
              maxLength={500}
              className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
            ></textarea>
          </div>
        </div>
      ),
    },
  };

  return (
    <div>
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
        <div className="notification error flex items-center gap-2 p-4 mb-4 bg-red-100 text-red-800 border border-red-300 rounded-lg">
          <i className="bi bi-exclamation-circle-fill text-2xl"></i>
          <span>{error}</span>
        </div>
      )}

      <div
        id="service-cards-container"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
      >
        {/* Visa Card */}
        <div
          className="service-card bg-white dark:bg-slate-800 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="visa"
        >
          <div className="price-tag absolute top-2 right-2 bg-[rgb(79_70_229)] text-white text-xs font-semibold py-1 px-2 rounded">
            $100
          </div>
          <div className="w-16 h-16 rounded-full bg-[rgb(238_242_255)] dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-patch-check-fill text-3xl text-[rgb(79_70_229)]"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            Taklifnoma & Viza
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Klinikadan taklifnoma oling va viza masalalarida yordam so'rang.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">
              Taklifnoma bepul, Viza $100
            </p>
            <button
              className="service-btn w-full bg-[rgb(238_242_255)] dark:bg-primary-800/50 text-[rgb(79_70_229)] dark:text-primary-200 font-semibold py-2 px-4 cursor-pointer rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
              onClick={() => handleServiceButtonClick("visa")}
            >
              Buyurtma qilish
            </button>
          </div>
        </div>

        {/* Transfer Card */}
        <div
          className="service-card bg-white dark:bg-slate-800 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="transfer"
        >
          <div className="free-ribbon absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold py-1 px-2 rounded">
            <span>Bepul</span>
          </div>
          <div className="w-16 h-16 rounded-full bg-[rgb(238_242_255)] dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-airplane text-[rgb(79_70_229)] text-3xl"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            Transfer Xizmati
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Aeroportdan kutib olish va klinikaga qulay yetib borishni
            ta'minlang.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">Bepul</p>
            <button
              className="service-btn w-full bg-[rgb(238_242_255)] dark:bg-primary-800/50 text-[rgb(79_70_229)] dark:text-primary-200 font-semibold py-2 px-4 cursor-pointer rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
              onClick={() => handleServiceButtonClick("transfer")}
            >
              Buyurtma qilish
            </button>
          </div>
        </div>

        {/* Hotel Card */}
        <div
          className="service-card bg-white dark:bg-slate-800 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="hotel"
        >
          <div className="price-tag absolute top-2 right-2 bg-[rgb(79_70_229)] text-white text-xs font-semibold py-1 px-2 rounded">
            $200
          </div>
          <div className="w-16 h-16 rounded-full bg-[rgb(238_242_255)] dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-building-check text-[rgb(79_70_229)] text-3xl"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            Mehmonxona
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Klinikaga yaqin va qulay mehmonxonalardan joy band qiling.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">
              Turiga qarab, o'rtacha 10 kunga $200
            </p>
            <button
              className="service-btn w-full bg-[rgb(238_242_255)] dark:bg-primary-800/50 text-[rgb(79_70_229)] dark:text-primary-200 font-semibold py-2 px-4 cursor-pointer rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
              onClick={() => handleServiceButtonClick("hotel")}
            >
              Buyurtma qilish
            </button>
          </div>
        </div>

        {/* Translator Card */}
        <div
          className="service-card bg-white dark:bg-slate-800 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="translator"
        >
          <div className="free-ribbon absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold py-1 px-2 rounded">
            <span>Bepul</span>
          </div>
          <div className="w-16 h-16 rounded-full bg-[rgb(238_242_255)] dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-translate text-[rgb(79_70_229)] text-3xl"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            Tarjimon Xizmati
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Davolanish jarayonida til bilan bog'liq muammolarga duch kelmang.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">Bepul</p>
            <button
              className="service-btn w-full bg-[rgb(238_242_255)] dark:bg-primary-800/50 text-[rgb(79_70_229)] dark:text-primary-200 font-semibold py-2 px-4 cursor-pointer rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
              onClick={() => handleServiceButtonClick("translator")}
            >
              Buyurtma qilish
            </button>
          </div>
        </div>

        {/* SIM Card */}
        <div
          className="service-card bg-white dark:bg-slate-800 rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="simcard"
        >
          <div className="price-tag absolute top-2 right-2 bg-[rgb(79_70_229)] text-white text-xs font-semibold py-1 px-2 rounded">
            $15
          </div>
          <div className="w-16 h-16 rounded-full bg-[rgb(238_242_255)] dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-sim text-[rgb(79_70_229)] text-3xl"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            SIM-karta
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Borgan davlatingizda yaqinlaringiz bilan aloqada bo'ling.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">
              $15 dan boshlanadi
            </p>
            <button
              className="service-btn w-full bg-[rgb(238_242_255)] dark:bg-primary-800/50 text-[rgb(79_70_229)] dark:text-primary-200 font-semibold py-2 px-4 cursor-pointer rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
              onClick={() => handleServiceButtonClick("simcard")}
            >
              Buyurtma qilish
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedService && (
        <div
          id="service-modal"
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <div className="modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
              <h3
                id="modal-title"
                className="text-lg font-bold text-slate-800 dark:text-white"
              >
                {modalContent[selectedService]?.title || "Xizmat"}
              </h3>
              <button
                data-close-modal="service-modal"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                onClick={closeModal}
              >
                <i className="bi bi-x-lg text-xl"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form
                id="service-form"
                data-service-id={selectedService}
                className="space-y-4"
                onSubmit={handleFormSubmit}
                noValidate
              >
                {modalContent[selectedService]?.body || null}
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <div className="flex items-center justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition"
                    onClick={closeModal}
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="bg-[rgb(79_70_229)] text-white font-bold py-2 px-5 rounded-lg hover:bg-[rgb(67_60_200)] transition"
                  >
                    Buyurtma qilish
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCard;
