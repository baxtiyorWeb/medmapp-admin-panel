// app/dashboard/page.js yoki components/PatientDashboardPage.js

"use client";
import "./patients.css";
import React, { useState } from "react";
import {
  Grid2X2,
  User,
  CalendarCheck,
  FileText,
  MessageSquare,
  CreditCard,
  Star,
  X,
} from "lucide-react";

const sidebarNavItems = [
  {
    icon: Grid2X2,
    label: "Boshqaruv paneli",
    href: "/dashboard",
    active: true,
  },
  { icon: User, label: "Mening profilim", href: "/patient_profile" },
  { icon: CalendarCheck, label: "Mening yozuvlarim", href: "/patient_queue" },
  { icon: FileText, label: "Tahlil natijalari", href: "/analysis" },
  {
    icon: MessageSquare,
    label: "Konsultatsiyalar",
    href: "/patient_consultation",
  },
  { icon: CreditCard, label: "To'lovlar", href: "/payments" },
  { icon: Star, label: "Izohlarim", href: "/reviews" },
];

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-8 bg-white w-full max-w-lg md:max-w-xl m-4 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
          <h5 className="text-xl font-bold">{title}</h5>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer flex justify-end items-center space-x-3 mt-4">
          {footer}
        </div>
      </div>
    </div>
  );
};

const PatientDashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Modal holatlari
  const [isVisaModalOpen, setIsVisaModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Dark mode toggle funksiyasi
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark-mode", !isDarkMode);
  };

  return (
    <>
      <div
        className="modal fade"
        id="visaModal"
        tabIndex={-1}
        aria-labelledby="visaModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="visaModalLabel"
                data-lang-key="modal_visa_title"
              >
                Taklifnoma & Viza uchun so'rov
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p className="text-muted small" data-lang-key="modal_visa_desc">
                Iltimos, pasportingizning skaner qilingan nusxasini yuklang va
                taxminiy kelish sanasini kiriting.
              </p>
              <form>
                <div className="mb-3">
                  <label
                    htmlFor="passportFile"
                    className="form-label"
                    data-lang-key="modal_visa_passport"
                  >
                    Pasport nusxasi (PDF, JPG)
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="passportFile"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="arrivalDate"
                    className="form-label"
                    data-lang-key="modal_visa_arrival"
                  >
                    Taxminiy kelish sanasi
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="arrivalDate"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light border"
                data-bs-dismiss="modal"
                data-lang-key="close"
              >
                Yopish
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-lang-key="send_request"
              >
                So'rov yuborish
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="transferModal"
        tabIndex={-1}
        aria-labelledby="transferModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="transferModalLabel"
                data-lang-key="modal_transfer_title"
              >
                Transfer xizmatiga buyurtma
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label
                    htmlFor="flightNumber"
                    className="form-label"
                    data-lang-key="modal_transfer_flight"
                  >
                    Parvoz raqami
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="flightNumber"
                    placeholder="HY-271"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label
                      htmlFor="transferDate"
                      className="form-label"
                      data-lang-key="modal_transfer_date"
                    >
                      Uchib kelish sanasi
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="transferDate"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label
                      htmlFor="transferTime"
                      className="form-label"
                      data-lang-key="modal_transfer_time"
                    >
                      Vaqti
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="transferTime"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="passengers"
                    className="form-label"
                    data-lang-key="modal_transfer_passengers"
                  >
                    Yo'lovchilar soni
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="passengers"
                    value="1"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light border"
                data-bs-dismiss="modal"
                data-lang-key="close"
              >
                Yopish
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-lang-key="order_now"
              >
                Buyurtma qilish
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="hotelModal"
        tabIndex={-1}
        aria-labelledby="hotelModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="hotelModalLabel"
                data-lang-key="modal_hotel_title"
              >
                Mehmonxona bron qilish
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label
                      htmlFor="checkinDate"
                      className="form-label"
                      data-lang-key="modal_hotel_checkin"
                    >
                      Kelish sanasi
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="checkinDate"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label
                      htmlFor="checkoutDate"
                      className="form-label"
                      data-lang-key="modal_hotel_checkout"
                    >
                      Ketish sanasi
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="checkoutDate"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="guests"
                    className="form-label"
                    data-lang-key="modal_hotel_guests"
                  >
                    Mehmonlar soni
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="guests"
                    value="1"
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="hotelClass"
                    className="form-label"
                    data-lang-key="modal_hotel_class"
                  >
                    Mehmonxona klassi
                  </label>
                  <select id="hotelClass" className="form-select">
                    <option selected data-lang-key="choose">
                      Tanlang...
                    </option>
                    <option>Ekonom</option>
                    <option>Standart</option>
                    <option>Lyuks</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light border"
                data-bs-dismiss="modal"
                data-lang-key="close"
              >
                Yopish
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-lang-key="order_now"
              >
                Buyurtma qilish
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="translatorModal"
        tabIndex={-1}
        aria-labelledby="translatorModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="translatorModalLabel"
                data-lang-key="modal_translator_title"
              >
                Tarjimon xizmatiga buyurtma
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label
                    htmlFor="language"
                    className="form-label"
                    data-lang-key="modal_translator_lang"
                  >
                    Kerakli til
                  </label>
                  <select id="language" className="form-select">
                    <option selected data-lang-key="choose">
                      Tanlang...
                    </option>
                    <option>Ingliz tili</option>
                    <option>Rus tili</option>
                    <option>Turk tili</option>
                    <option>Hind tili</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="serviceDays"
                    className="form-label"
                    data-lang-key="modal_translator_days"
                  >
                    Xizmat kerak bo'ladigan kunlar soni
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="serviceDays"
                    value="3"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light border"
                data-bs-dismiss="modal"
                data-lang-key="close"
              >
                Yopish
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-lang-key="order_now"
              >
                Buyurtma qilish
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="simModal"
        tabIndex={-1}
        aria-labelledby="simModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="simModalLabel"
                data-lang-key="modal_sim_title"
              >
                SIM-kartaga buyurtma
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p data-lang-key="modal_sim_desc">
                Mahalliy SIM-kartaga buyurtma berishni tasdiqlaysizmi? Bizning
                operator siz bilan bog'lanib, tariflar haqida ma'lumot beradi.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light border"
                data-bs-dismiss="modal"
                data-lang-key="no"
              >
                Yo'q
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-lang-key="yes_confirm"
              >
                Ha, tasdiqlayman
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDashboardPage;
