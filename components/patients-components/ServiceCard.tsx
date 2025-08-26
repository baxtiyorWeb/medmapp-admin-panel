import React, { useState } from "react";

const ServiceCard = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Function to check if formData exists and currentStep is at least 4
  const isFormDataValid = () => {
    try {
      const data = JSON.parse(localStorage.getItem("formData") || "{}");
      // Check if formData exists and currentStep >= 4
      return data.formData && data.currentStep && data.currentStep >= 4;
    } catch (error) {
      console.error("Error parsing formData from localStorage:", error);
      return false;
    }
  };

  // Function to handle service button click
  const handleServiceButtonClick = (serviceId: string) => {
    if (!isFormDataValid()) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } else {
      setSelectedService(serviceId);
      const modal = document.getElementById("service-modal");
      if (modal) {
        modal.classList.remove("hidden");
      }
    }
  };

  // Function to close the modal
  const closeModal = () => {
    const modal = document.getElementById("service-modal");
    if (modal) {
      modal.classList.add("hidden");
    }
    setSelectedService(null);
  };

  // Function to handle form submission
  const handleFormSubmit = () => {
    const fileInput = document.getElementById(
      "service-file-passportScan"
    ) as HTMLInputElement | null;
    const notes =
      (document.getElementById("service-notes") as HTMLInputElement | null)
        ?.value || "";
    const serviceId = selectedService;
    // Update orderedServices in localStorage
    try {
      const data = JSON.parse(localStorage.getItem("formData") || "{}");
      data.formData = data.formData || { orderedServices: [] };
      data.formData.orderedServices = data.formData.orderedServices || [];
      data.formData.orderedServices.push({
        serviceId,
        passportScan: fileInput?.files?.[0]?.name || null,
        notes,
      });
      localStorage.setItem("formData", JSON.stringify(data));
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }

    closeModal();
  };

  return (
    <div>
      <h1 className="text-xl my-4 font-bold text-slate-800 dark:text-white">
        Qo&apos;shimcha xizmatlar
      </h1>

      {/* Notification */}
      {showNotification && (
        <div className="notification warning flex items-center gap-2 p-4 mb-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg">
          <i className="bi bi-exclamation-triangle-fill text-2xl"></i>
          <span>Iltimos, avval asosiy anketani to&apos;ldirib yuboring.</span>
        </div>
      )}

      <div
        id="service-cards-container"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
      >
        <div
          className="service-card bg-white rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="invitation"
        >
          <div className="price-tag">$100</div>
          <div className="w-16 h-16 rounded-full bg-[rgb(238_242_255)] dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-patch-check-fill text-3xl text-[rgb(79_70_229)]"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            Taklifnoma &amp; Viza
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Klinikadan taklifnoma oling va viza masalalarida yordam
            so&apos;rang.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">
              Taklifnoma bepul, Viza $100
            </p>
            <button
              className="service-btn w-full bg-[rgb(238_242_255)] dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
              onClick={() => handleServiceButtonClick("invitation")}
            >
              Buyurtma
            </button>
          </div>
        </div>

        <div
          className="service-card bg-white rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="transfer"
        >
          <div className="free-ribbon">
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
            ta&apos;minlang.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">Bepul</p>
            <button
              className="service-btn w-full bg-[rgb(238_242_255)] dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
              onClick={() => handleServiceButtonClick("transfer")}
            >
              Buyurtma
            </button>
          </div>
        </div>

        <div
          className="service-card bg-white rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="hotel"
        >
          <div className="price-tag">$200</div>
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
              Turiga qarab, o&apos;rtacha 10 kunga $200
            </p>
            <button
              className="service-btn w-full bg-[rgb(238_242_255)] dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
              onClick={() => handleServiceButtonClick("hotel")}
            >
              Buyurtma
            </button>
          </div>
        </div>

        <div
          className="service-card bg-white rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="translator"
        >
          <div className="free-ribbon">
            <span>Bepul</span>
          </div>
          <div className="w-16 h-16 rounded-full bg-[rgb(238_242_255)] dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-translate text-[rgb(79_70_229)] text-3xl"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            Tarjimon Xizmati
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Davolanish jarayonida til bilan bog&apos;liq muammolarga duch
            kelmang.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">Bepul</p>
            <button
              className="service-btn w-full bg-[rgb(238_242_255)] dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
              onClick={() => handleServiceButtonClick("translator")}
            >
              Buyurtma
            </button>
          </div>
        </div>
        {/* / */}
        <div
          className="service-card bg-white rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="simcard"
        >
          <div className="price-tag">$15</div>
          <div className="w-16 h-16 rounded-full bg-[rgb(238_242_255)] dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-sim text-[rgb(79_70_229)] text-3xl"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            SIM-karta
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Borgan davlatingizda yaqinlaringiz bilan aloqada bo&apos;ling.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">
              $15 dan boshlanadi
            </p>
            <button
              className="service-btn cursor-pointer w-full bg-[rgb(238_242_255)] dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition"
              onClick={() => handleServiceButtonClick("simcard")}
            >
              Buyurtma
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        id="service-modal"
        className="modal-backdrop fixed inset-0 z-50 items-center justify-center bg-black/70 hidden"
      >
        <div className="modal-content bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
            <h3 id="modal-title" className="text-lg font-bold">
              {selectedService === "invitation" && "Taklifnoma & Viza"}
              {selectedService === "transfer" && "Transfer Xizmati"}
              {selectedService === "hotel" && "Mehmonxona"}
              {selectedService === "translator" && "Tarjimon Xizmati"}
              {selectedService === "simcard" && "SIM-karta"}
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
              noValidate
            >
              {selectedService === "invitation" && (
                <>
                  <div>
                    <label
                      htmlFor="service-passportScan"
                      className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
                    >
                      Xorijga chiqish pasporti nusxasi{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <label
                      htmlFor="service-file-passportScan"
                      className="relative block w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 text-center cursor-pointer hover:border-[rgb(79_70_229)] dark:hover:border-primary-400 transition-colors bg-slate-50 dark:bg-slate-700/50"
                    >
                      <i className="bi bi-cloud-arrow-up-fill text-3xl text-[rgb(79_70_229)]"></i>
                      <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Fayl yuklash
                      </p>
                    </label>
                    <input
                      id="service-file-passportScan"
                      type="file"
                      className="hidden"
                      data-service-id="invitation"
                      data-field-id="passportScan"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service-notes"
                      className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
                    >
                      Qo&apos;shimcha izoh
                    </label>
                    <textarea
                      id="service-notes"
                      placeholder=""
                      rows={3}
                      className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
                    ></textarea>
                  </div>
                </>
              )}
              {selectedService === "transfer" && (
                <div>
                  <label
                    htmlFor="service-notes"
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
                  >
                    Qo&apos;shimcha izoh
                  </label>
                  <textarea
                    id="service-notes"
                    placeholder="Masalan, aeroportga kelish vaqti yoki maxsus talablar"
                    rows={3}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
                  ></textarea>
                </div>
              )}
              {selectedService === "hotel" && (
                <div>
                  <label
                    htmlFor="service-notes"
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
                  >
                    Qo&apos;shimcha izoh
                  </label>
                  <textarea
                    id="service-notes"
                    placeholder="Masalan, mehmonxona turi yoki qo‘shimcha xizmatlar"
                    rows={3}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
                  ></textarea>
                </div>
              )}
              {selectedService === "translator" && (
                <div>
                  <label
                    htmlFor="service-notes"
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
                  >
                    Qo&apos;shimcha izoh
                  </label>
                  <textarea
                    id="service-notes"
                    placeholder="Masalan, qaysi tillar kerak yoki maxsus talablar"
                    rows={3}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
                  ></textarea>
                </div>
              )}
              {selectedService === "simcard" && (
                <div>
                  <label
                    htmlFor="service-notes"
                    className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 block"
                  >
                    Qo&apos;shimcha izoh
                  </label>
                  <textarea
                    id="service-notes"
                    placeholder="Masalan, SIM-karta turi yoki qo‘shimcha xizmatlar"
                    rows={3}
                    className="w-full p-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[rgb(79_70_229)] focus:border-[rgb(79_70_229)] outline-none transition"
                  ></textarea>
                </div>
              )}
            </form>
          </div>
          <div className="flex items-center justify-end p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl space-x-3 mt-auto">
            <button
              data-close-modal="service-modal"
              type="button"
              className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition"
              onClick={closeModal}
            >
              Bekor qilish
            </button>
            <button
              type="button"
              id="save-service-btn"
              className="bg-[rgb(79_70_229)] text-white font-bold py-2 px-5 rounded-lg hover:bg-[rgb(67_60_200)] transition"
              onClick={handleFormSubmit}
            >
              Buyurtma qilish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
