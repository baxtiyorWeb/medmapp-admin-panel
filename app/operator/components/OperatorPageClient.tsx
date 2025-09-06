"use client";
import React, { useEffect } from "react";
import Head from "next/head";
import KanbanBoard from "./KanbanBoard";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebarToggle from "@/hooks/useSidebarToggle";

const OperatorPage = () => {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [isSidebarOpen, toggleSidebar] = useSidebarToggle();

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isSidebarOpen) {
      document.body.classList.add("toggle-sidebar");
    } else {
      document.body.classList.remove("toggle-sidebar");
    }
  }, [isSidebarOpen]);

  return (
    <div className={`wrapper ${isSidebarOpen ? "" : "sidebar-closed"}`}>
      <Head>
        <title>MedMap.uz Boshqaruv Paneli</title>
      </Head>

      {/* Sidebar */}
      <aside id="sidebar" className="sidebar">
        {/* ... mavjud sidebar kodi ... */}
        <a href="#" className="logo d-flex align-items-center">
          <img
            src="https://medmap.uz/images/MedMapp_Logo_shaffof.png"
            alt="MedMap Logo"
            className="logo-full"
          />
          <img
            src="https://medmap.uz/images/favicon.png"
            alt="MedMap Icon"
            className="logo-icon"
          />
        </a>
        <div className="sidebar-nav nav flex-column mt-4 flex-grow-1">
          <a className="nav-link active" href="#">
            <i className="bi bi-grid-1x2-fill"></i>
            <span>Boshqaruv Paneli</span>
          </a>
          <a className="nav-link" href="#">
            <i className="bi bi-telephone-inbound"></i>
            <span>Yangi Murojaatlar</span>
          </a>
          <a className="nav-link" href="#">
            <i className="bi bi-check2-circle"></i>
            <span>Bajarilgan Murojaatlar</span>
          </a>
          <a className="nav-link" href="#">
            <i className="bi bi-building"></i>
            <span>Klinikalar Bazasi</span>
          </a>
          <a className="nav-link" href="#">
            <i className="bi bi-cash-coin"></i>
            <span>Moliya</span>
          </a>
        </div>
        <div className="logout">
          <a className="nav-link" href="#">
            <i className="bi bi-box-arrow-left"></i>
            <span>Chiqish</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            {/* Sidebar toggle button */}
            <i
              className="bi bi-list toggle-sidebar-btn me-3 fs-4"
              onClick={toggleSidebar}
            ></i>
          </div>
          <nav className="header-nav d-flex align-items-center">
            {/* Dark Mode toggle button */}
            <a
              className="nav-link nav-icon"
              id="dark-mode-toggle"
              onClick={toggleDarkMode}
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="Tungi/Kunduzgi rejim"
            >
              <i
                className={`bi ${isDarkMode ? "bi-sun" : "bi-moon-stars"}`}
              ></i>
            </a>
            {/* ... qolgan header elementlari ... */}
            <a
              className="nav-link nav-icon"
              href="#"
              data-bs-toggle="modal"
              data-bs-target="#tagManagementModal"
              data-bs-placement="bottom"
              title="Sozlamalar"
            >
              <i className="bi bi-gear-fill"></i>
            </a>
            <a
              className="nav-link nav-icon"
              href="#"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title="Bildirishnomalar"
            >
              <i className="bi bi-bell"></i>
            </a>
            <div className="vr h-50 d-none d-sm-block mx-2"></div>
            <div className="nav-item dropdown">
              <a
                className="nav-link nav-profile d-flex align-items-center ps-sm-2"
                href="#"
                data-bs-toggle="dropdown"
              >
                <img
                  src="https://placehold.co/40x40/012970/ffffff?text=O"
                  alt="Profile"
                  className="rounded-circle"
                />
                <div className="d-none d-md-flex flex-column align-items-start ms-2">
                  <span className="fw-bold" id="operator-name">
                    Operator #1
                  </span>
                  <span className="text-muted small">callcenter@medmap.uz</span>
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-person"></i>
                    <span>Profil</span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="#"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Chiqish</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        {/* ... qolgan main-content kodi ... */}
        <main className="page-content">
          <section className="section dashboard">
            {/* Boshqaruv Paneli Boshligi */}
            <div className="page-controls">
              <div className="pagetitle">
                <h1>Boshqaruv Paneli</h1>
              </div>
              <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
                <div
                  className="d-flex align-items-center gap-2"
                  id="filter-group"
                >
                  <div className="input-group" style={{ width: "auto" }}>
                    <span className="input-group-text bg-transparent border-end-0 text-muted">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="search"
                      className="form-control border-start-0"
                      id="search-patient-input"
                      placeholder="Bemor qidirish..."
                    />
                  </div>
                  <div className="filter-btn-group btn-group" role="group">
                    <button type="button" className="btn">
                      Kunlik
                    </button>
                    <button type="button" className="btn active">
                      Haftalik
                    </button>
                    <button type="button" className="btn">
                      Oylik
                    </button>
                    <button type="button" className="btn">
                      Yillik
                    </button>
                  </div>
                  <button
                    className="btn btn-light border"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#filtersOffcanvas"
                  >
                    <i className="bi bi-funnel"></i>
                    <span className="d-none d-sm-inline ms-1">Filtr</span>
                  </button>
                </div>
                <button
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#newPatientModal"
                >
                  <i className="bi bi-plus-lg"></i>
                  <span className="d-none d-sm-inline ms-1">Yangi Bemor</span>
                </button>
              </div>
            </div>

            {/* STATISTIKA KARTALARI (MUKAMMALLASHTIRILGAN DIZAYN) */}
            <div className="row g-4 mb-4">
              {/* Jami Bitimlar Karta */}
              <div className="col-lg-3 col-md-6">
                <div className="stat-card-v3">
                  <div className="stat-icon-wrapper bg-icon-primary">
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-title">Jami Bitimlar</p>
                    <h4 className="stat-value">2,564</h4>
                    <p className="stat-change text-success mb-0">
                      <i className="bi bi-arrow-up"></i>
                      <span>2.1%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Yangi Bemorlar Karta */}
              <div className="col-lg-3 col-md-6">
                <div className="stat-card-v3">
                  <div className="stat-icon-wrapper bg-icon-success">
                    <i className="bi bi-person-plus-fill"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-title">Yangi Bemorlar</p>
                    <h4 className="stat-value">856</h4>
                    <p className="stat-change text-success mb-0">
                      <i className="bi bi-arrow-up"></i>
                      <span>5.5%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Faol Bemorlar Karta */}
              <div className="col-lg-3 col-md-6">
                <div className="stat-card-v3">
                  <div className="stat-icon-wrapper bg-icon-warning">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-title">Faol Bemorlar</p>
                    <h4 className="stat-value">5,464</h4>
                    <p className="stat-change text-danger mb-0">
                      <i className="bi bi-arrow-down"></i>
                      <span>1.1%</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Kutilayotgan Daromad Karta */}
              <div className="col-lg-3 col-md-6">
                <div className="stat-card-v3">
                  <div className="stat-icon-wrapper bg-icon-info">
                    <i className="bi bi-cash-stack"></i>
                  </div>
                  <div className="stat-content">
                    <p className="stat-title">Kutilayotgan Daromad</p>
                    <h4 className="stat-value">$2,564</h4>
                    <p className="stat-change text-success mb-0">
                      <i className="bi bi-arrow-up"></i>
                      <span>3.3%</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* KANBAN DOSKASI */}
            <KanbanBoard />
          </section>
        </main>
      </div>

      <div className="mobile-overlay"></div>
      <div className="toast-container position-fixed top-0 end-0 p-3"></div>

      {/* Offcanvas va Modallar */}
      <div
        className="offcanvas offcanvas-end offcanvas-details"
        tabIndex={-1}
        id="patientDetailsOffcanvas"
        style={{ width: "600px" }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title" id="patientDetailsName">
            Bemor Ma&apos;lumotlari
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body" id="patientDetailsBody"></div>
      </div>

      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="filtersOffcanvas"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">Filtrlar</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <label className="form-label">Tegi bo&apos;yicha</label>
            <div id="filter-tags-container"></div>
          </div>
          <div className="mb-3">
            <label htmlFor="filter-stage" className="form-label">
              Bosqich bo&apos;yicha
            </label>
            <select className="form-select" id="filter-stage">
              <option value="">Barchasi</option>
            </select>
          </div>
          <div className="mt-4">
            <button className="btn btn-primary w-100" id="apply-filters-btn">
              Qo&apos;llash
            </button>
            <button className="btn btn-light w-100 mt-2" id="reset-filters-btn">
              Tozalash
            </button>
          </div>
        </div>
      </div>

      {/* YANGI BEMOR QO'SHISH MODALI (BOSQICHMA-BOSQICH) */}
      <div className="modal fade" id="newPatientModal" tabIndex={-1}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Konsultatsiya uchun Anketa</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              {/* Bosqichlar Navigatsiyasi (Progress Bar) */}
              <div className="wizard-progress">
                <div className="wizard-progress-bar"></div>
                <div className="wizard-progress-step active" data-step="1">
                  <div className="step-icon">1</div>
                  <div className="step-label">Shaxsiy</div>
                </div>
                <div className="wizard-progress-step" data-step="2">
                  <div className="step-icon">2</div>
                  <div className="step-label">Tibbiy</div>
                </div>
                <div className="wizard-progress-step" data-step="3">
                  <div className="step-icon">3</div>
                  <div className="step-label">Hujjatlar</div>
                </div>
              </div>

              <form id="new-patient-form">
                {/* 1-qadam: Shaxsiy ma'lumotlar */}
                <div className="wizard-step active" id="step-1">
                  <h6 className="mb-3">Shaxsiy ma&apos;lumotlar</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Ism-familiya</label>
                      <input
                        type="text"
                        id="new-patient-name"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Pasport</label>
                      <input
                        type="text"
                        id="new-patient-passport"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Tug&apos;ilgan sana</label>
                      <input
                        type="date"
                        id="new-patient-dob"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Jins</label>
                      <select id="new-patient-gender" className="form-select">
                        <option selected>Tanlang...</option>
                        <option value="Erkak">Erkak</option>
                        <option value="Ayol">Ayol</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Telefon</label>
                      <input
                        type="tel"
                        id="new-patient-phone"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Pochta</label>
                      <input
                        type="email"
                        id="new-patient-email"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {/* 2-qadam: Tibbiy ma'lumotlar */}
                <div className="wizard-step" id="step-2">
                  <h6 className="mb-3">Tibbiy ma&apos;lumotlar</h6>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Shikoyatlar</label>
                      <textarea
                        id="new-patient-complaints"
                        className="form-control"
                        rows={4}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Avvalgi tashxis</label>
                      <input
                        type="text"
                        id="new-patient-diagnosis"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>

                {/* 3-qadam: Hujjatlar */}
                <div className="wizard-step" id="step-3">
                  <h6 className="mb-3">Hujjatlarni yuklash</h6>
                  <input
                    className="form-control"
                    type="file"
                    id="new-patient-files"
                    multiple
                  />
                  <div id="new-patient-file-list" className="mt-2"></div>
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="form-agreement"
                      required
                    />
                    <label
                      className="form-check-label"
                      htmlFor="form-agreement"
                    >
                      Men kiritgan barcha ma&apos;lumotlarning
                      to&apos;g&apos;riligini tasdiqlayman hamda{" "}
                      <a href="#">Ommaviy oferta</a> va{" "}
                      <a href="#">Foydalanish shartlari</a> bilan tanishib
                      chiqdim.
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                id="wizard-back-btn"
                style={{ display: "none" }}
              >
                Orqaga
              </button>
              <button
                type="button"
                className="btn btn-primary"
                id="wizard-next-btn"
              >
                Keyingisi
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="stageChangeCommentModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Bosqichni O&apos;zgartirish</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Bemor <strong id="comment-patient-name"></strong> uchun yangi
                bosqich: <strong id="comment-new-stage"></strong>
              </p>
              <div className="mb-3">
                <label htmlFor="stage-change-comment" className="form-label">
                  Izoh (majburiy)
                </label>
                <textarea
                  className="form-control"
                  id="stage-change-comment"
                  rows={3}
                  required
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                className="btn btn-primary"
                id="save-stage-change-btn"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="tagManagementModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Holatlarni (Teglarni) Boshqarish</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <h6>Mavjud Holatlar</h6>
              <ul className="list-group mb-4" id="tags-list"></ul>
              <h6>Yangi Holat Qo&apos;shish</h6>
              <div className="input-group">
                <input
                  type="text"
                  id="new-tag-name"
                  className="form-control"
                  placeholder="Yangi holat nomi..."
                />
                <select
                  id="new-tag-color"
                  className="form-select flex-grow-0 w-auto"
                >
                  <option value="success">Yashil</option>
                  <option value="warning">Sariq</option>
                  <option value="danger">Qizil</option>
                  <option value="primary">Ko&apos;k</option>
                  <option value="secondary">Kulrang</option>
                </select>
                <button className="btn btn-primary" id="add-new-tag-btn">
                  Qo&apos;shish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteConfirmModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tasdiqlash</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Rostdan ham <strong id="delete-patient-name"></strong> ismli
                bemorni o&apos;chirmoqchimisiz? Bu amalni orqaga qaytarib
                bo&apos;lmaydi.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Yo&apos;q
              </button>
              <button
                type="button"
                className="btn btn-danger"
                id="confirm-delete-btn"
              >
                Ha, o&apos;chirish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorPage;
