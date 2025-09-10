"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  initialPatients,
  initialStages,
  initialTags,
  Patient,
  Stage,
  Tag,
} from "../../../lib/data";
import Sortable from "sortablejs";
import { Modal, Offcanvas, Tooltip, Toast } from "bootstrap";

type PatientToMove = { patientId: number; newStageId: string } | null;

export default function DashboardPage() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarToggled, setSidebarToggled] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [stages] = useState<Stage[]>(initialStages);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTimeFilter, setActiveTimeFilter] = useState("Haftalik");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingSection, setEditingSection] = useState<
    "personal" | "medical" | null
  >(null);
  const [editingPatientDetails, setEditingPatientDetails] = useState<
    Patient["details"] | null
  >(null);
  const [patientToMove, setPatientToMove] = useState<PatientToMove>(null);
  const [stageChangeComment, setStageChangeComment] = useState("");
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [newPatientFiles, setNewPatientFiles] = useState<File[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("success");

  const offcanvasInstance = useRef<Offcanvas | null>(null);
  const stageModalInstance = useRef<Modal | null>(null);
  const deleteModalInstance = useRef<Modal | null>(null);
  const newPatientModalInstance = useRef<Modal | null>(null);
  const tagModalInstance = useRef<Modal | null>(null);
  const kanbanBoardRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  const showToast = (
    message: string,
    type: "success" | "danger" | "warning" = "success"
  ) => {
    const toastContainer = document.querySelector(".toast-container");
    if (toastContainer) {
      const toastEl = document.createElement("div");
      toastEl.className = `toast align-items-center text-bg-${type} border-0`;
      toastEl.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
      toastContainer.appendChild(toastEl);
      const toast = new Toast(toastEl);
      toast.show();
      toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const time = date.toTimeString().slice(0, 5);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${time} | ${day}.${month}.${year}`;
  };

  const getNextStepText = (stageId: string) => {
    const nextSteps: { [key: string]: string } = {
      stage1: "Hujjatlarni so'rash",
      stage2: "Klinika tanlash",
      stage3: "To'lovni qabul qilish",
      stage4: "Safar sanasini belgilash",
      stage5: "Yopilgan",
    };
    return nextSteps[stageId] || "Noma'lum";
  };

  useEffect(() => {
    setFilteredPatients(
      patients.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, patients]);

  useEffect(() => {
    if (isMounted.current) return;
    Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]')).forEach(
      (el) => new Tooltip(el)
    );
    const offcanvasEl = document.getElementById("patientDetailsOffcanvas");
    if (offcanvasEl) offcanvasInstance.current = new Offcanvas(offcanvasEl);
    const stageModalEl = document.getElementById("stageChangeCommentModal");
    if (stageModalEl) stageModalInstance.current = new Modal(stageModalEl);
    const deleteModalEl = document.getElementById("deleteConfirmModal");
    if (deleteModalEl) deleteModalInstance.current = new Modal(deleteModalEl);
    const newPatientModalEl = document.getElementById("newPatientModal");
    if (newPatientModalEl)
      newPatientModalInstance.current = new Modal(newPatientModalEl);
    const tagModalEl = document.getElementById("tagManagementModal");
    if (tagModalEl) tagModalInstance.current = new Modal(tagModalEl);

    const handleModalHide = () => {
      setWizardStep(1);
      setNewPatientFiles([]);
      (document.getElementById("new-patient-form") as HTMLFormElement)?.reset();
    };
    newPatientModalEl?.addEventListener("hidden.bs.modal", handleModalHide);

    isMounted.current = true;
    return () => {
      newPatientModalEl?.removeEventListener(
        "hidden.bs.modal",
        handleModalHide
      );
    };
  }, []);

  useEffect(() => {
    if (!kanbanBoardRef.current) return;
    const containers = Array.from(
      kanbanBoardRef.current.querySelectorAll(".kanban-cards")
    );
    const sortableInstances: Sortable[] = [];
    containers.forEach((container) => {
      sortableInstances.push(
        new Sortable(container as HTMLElement, {
          group: "kanban",
          animation: 150,
          ghostClass: "sortable-ghost",
          onEnd: (evt) => {
            evt.from.insertBefore(evt.item, evt.from.children[evt.oldIndex!]);
            if (evt.from !== evt.to) {
              setPatientToMove({
                patientId: parseInt(evt.item.dataset.id!),
                newStageId: evt.to.dataset.stageId!,
              });
            }
          },
        })
      );
    });
    return () => sortableInstances.forEach((instance) => instance.destroy());
  }, [filteredPatients]);

  useEffect(() => {
    selectedPatient
      ? offcanvasInstance.current?.show()
      : offcanvasInstance.current?.hide();
  }, [selectedPatient]);
  useEffect(() => {
    patientToMove
      ? stageModalInstance.current?.show()
      : stageModalInstance.current?.hide();
  }, [patientToMove]);
  useEffect(() => {
    patientToDelete
      ? deleteModalInstance.current?.show()
      : deleteModalInstance.current?.hide();
  }, [patientToDelete]);
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark")
      document.documentElement.classList.add("dark-mode");
  }, []);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1200) setSidebarToggled(!isSidebarToggled);
    else setSidebarCollapsed(!isSidebarCollapsed);
  };
  const handleThemeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const newTheme = document.documentElement.classList.contains("dark-mode")
      ? "light"
      : "dark";
    document.documentElement.classList.toggle("dark-mode");
    localStorage.setItem("theme", newTheme);
  };
  const handleStartEditing = (section: "personal" | "medical") => {
    if (!selectedPatient) return;
    setEditingSection(section);
    setEditingPatientDetails(
      JSON.parse(JSON.stringify(selectedPatient.details))
    );
  };
  const handleCancelEditing = () => {
    setEditingSection(null);
    setEditingPatientDetails(null);
  };
  const handleSaveDetails = () => {
    if (!selectedPatient || !editingPatientDetails) return;
    const updatedPatient = {
      ...selectedPatient,
      details: editingPatientDetails,
    };
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setSelectedPatient(updatedPatient);
    handleCancelEditing();
    showToast("Ma'lumotlar saqlandi");
  };
  const handleDetailChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!editingPatientDetails) return;
    setEditingPatientDetails((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : null
    );
  };
  const handleTagChangeInDetails = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newTagId = parseInt(e.target.value);
    if (!selectedPatient) return;
    const updatedPatient = { ...selectedPatient, tagId: newTagId };
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setSelectedPatient(updatedPatient);
    showToast("Holat o'zgartirildi");
  };
  const confirmStageChange = () => {
    if (!patientToMove || !stageChangeComment.trim()) {
      showToast("Iltimos, izoh yozing!", "danger");
      return;
    }
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientToMove.patientId
          ? {
              ...p,
              stageId: patientToMove.newStageId,
              history: [
                ...p.history,
                {
                  date: new Date().toISOString(),
                  author: "Operator #1",
                  text: stageChangeComment,
                },
              ],
            }
          : p
      )
    );
    showToast("Bosqich muvaffaqiyatli o'zgartirildi");
    setStageChangeComment("");
    setPatientToMove(null);
  };
  const confirmDeletePatient = () => {
    if (!patientToDelete) return;
    setPatients((prev) => prev.filter((p) => p.id !== patientToDelete.id));
    showToast("Bemor muvaffaqiyatli o'chirildi.", "warning");
    setPatientToDelete(null);
    setSelectedPatient(null);
  };
  const handleWizardNext = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
      return;
    }
    const form = document.getElementById("new-patient-form") as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    if (!name || !phone) {
      showToast("Ism va Telefon maydonlari majburiy!", "danger");
      setWizardStep(1);
      return;
    }
    const newPatient: Omit<Patient, "id"> = {
      name,
      tagId: 1,
      stageId: "stage1",
      source: "Anketa",
      createdBy: "Operator #1",
      history: [
        {
          date: new Date().toISOString(),
          author: "Tizim",
          text: "Bemor profili yaratildi.",
        },
      ],
      details: {
        passport: formData.get("passport") as string,
        dob: formData.get("dob") as string,
        gender: formData.get("gender") as string,
        phone,
        email: formData.get("email") as string,
        complaints: formData.get("complaints") as string,
        previousDiagnosis: formData.get("diagnosis") as string,
        documents: newPatientFiles.map((f) => ({ name: f.name, url: "#" })),
      },
    };
    setPatients((prev) => [{ ...newPatient, id: Date.now() }, ...prev]);
    showToast("Yangi bemor qo'shildi");
    newPatientModalInstance.current?.hide();
  };
  const handleWizardBack = () => {
    if (wizardStep > 1) setWizardStep(wizardStep - 1);
  };
  const handleAddNewTag = () => {
    if (!newTagName.trim()) return;
    setTags((prev) => [
      ...prev,
      { id: Date.now(), text: newTagName, color: newTagColor },
    ]);
    setNewTagName("");
    showToast("Yangi holat qo'shildi");
  };
  const handleDeleteTag = (tagId: number) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId));
    showToast("Holat o'chirildi", "warning");
  };

  return (
    <>
      <div
        className={`wrapper ${isSidebarCollapsed ? "sidebar-collapsed" : ""} ${
          isSidebarToggled ? "sidebar-toggled" : ""
        }`}
      >
        <aside id="sidebar" className="sidebar">
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

        <div className="main-content">
          <header className="header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <i
                className="bi bi-list toggle-sidebar-btn me-3 fs-4"
                onClick={handleToggleSidebar}
              ></i>
            </div>
            <nav className="header-nav d-flex align-items-center">
              <a
                className="nav-link nav-icon"
                id="dark-mode-toggle"
                href="#"
                onClick={handleThemeToggle}
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title="Tungi/Kunduzgi rejim"
              >
                <i className="bi bi-moon-stars"></i>
              </a>
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
                    <span className="text-muted small">
                      callcenter@medmap.uz
                    </span>
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                  <li>
                    {" "}
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      {" "}
                      <i className="bi bi-person"></i> <span>Profil</span>{" "}
                    </a>{" "}
                  </li>
                  <li>
                    {" "}
                    <hr className="dropdown-divider" />{" "}
                  </li>
                  <li>
                    {" "}
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      {" "}
                      <i className="bi bi-box-arrow-right"></i>{" "}
                      <span>Chiqish</span>{" "}
                    </a>{" "}
                  </li>
                </ul>
              </div>
            </nav>
          </header>

          <main className="page-content">
            <section className="section dashboard">
              <div className="page-controls d-flex flex-wrap ">
                {/* Page Title */}

                {/* Controls Group */}
                <div className="d-flex flex-wrap align-items-center justify-content-between w-full gap-2">
                <div className="pagetitle mb-3">
                  <h1>Boshqaruv Paneli</h1>
                </div>
                  {/* Filter & Search Group */}
                  <div
                    className="d-flex align-items-center gap-2"
                    id="filter-group"
                  >
                    {/* Search Input */}
                    <div className="input-group  border" style={{ width: "auto" }}>
                      <span className="input-group-text bg-transparent border-end-0 text-muted">
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="search"
                        className="form-control border-start-0 w-[300px]"
                        id="search-patient-input"
                        placeholder="Bemor qidirish..."
                      />
                    </div>

                    {/* Filter Buttons */}
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

                    {/* Offcanvas Filter Button */}
                    <button
                      className="btn btn-light border w-[150px]"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#filtersOffcanvas"
                    >
                      <i className="bi bi-funnel"></i>
                      <span className="d-none d-sm-inline ms-1">Filtr</span>
                    </button>
                  {/* New Patient Button */}
                  </div>
                  <button
                    className="btn btn-primary w-[80px]"
                    data-bs-toggle="modal"
                    data-bs-target="#newPatientModal"
                  >
                    <i className="bi bi-plus-lg"></i>
                    <span className="d-none d-sm-inline ms-1">Yangi Bemor</span>
                  </button>

                </div>
              </div>

              <div className="row g-4 mb-4">
                <div className="col-lg-3 col-md-6">
                  <div className="stat-card-v3">
                    <div className="stat-icon-wrapper bg-icon-primary">
                      <i className="bi bi-people-fill"></i>
                    </div>
                    <div className="stat-content">
                      <p className="stat-title">Jami Bitimlar</p>
                      <h4 className="stat-value">{patients.length}</h4>
                      <p className="stat-change text-success mb-0">
                        <i className="bi bi-arrow-up"></i>
                        <span>2.1%</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="stat-card-v3">
                    <div className="stat-icon-wrapper bg-icon-success">
                      <i className="bi bi-person-plus-fill"></i>
                    </div>
                    <div className="stat-content">
                      <p className="stat-title">Yangi Bemorlar</p>
                      <h4 className="stat-value">
                        {patients.filter((p) => p.stageId === "stage1").length}
                      </h4>
                      <p className="stat-change text-success mb-0">
                        <i className="bi bi-arrow-up"></i>
                        <span>5.5%</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6">
                  <div className="stat-card-v3">
                    <div className="stat-icon-wrapper bg-icon-warning">
                      <i className="bi bi-check-circle-fill"></i>
                    </div>
                    <div className="stat-content">
                      <p className="stat-title">Faol Bemorlar</p>
                      <h4 className="stat-value">
                        {patients.filter((p) => p.stageId !== "stage5").length}
                      </h4>
                      <p className="stat-change text-danger mb-0">
                        <i className="bi bi-arrow-down"></i>
                        <span>1.1%</span>
                      </p>
                    </div>
                  </div>
                </div>
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

              <div className="kanban-wrapper">
                <div className="kanban-board" ref={kanbanBoardRef}>
                  {stages.map((stage) => {
                    const patientsInStage = filteredPatients.filter(
                      (p) => p.stageId === stage.id
                    );
                    return (
                      <div
                        key={stage.id}
                        className={`kanban-column ${stage.colorClass}`}
                      >
                        <div className="kanban-column-header">
                          <span>
                            {stage.title} ({patientsInStage.length})
                          </span>
                        </div>
                        <div className="kanban-cards" data-stage-id={stage.id}>
                          {patientsInStage.length > 0 ? (
                            patientsInStage.map((patient) => {
                              const tag = tags.find(
                                (t) => t.id === patient.tagId
                              ) || { color: "secondary", text: "Noma'lum" };
                              const lastHistory =
                                patient.history[patient.history.length - 1];
                              return (
                                <div
                                  key={patient.id}
                                  className="kanban-card"
                                  data-id={patient.id}
                                  onClick={() => setSelectedPatient(patient)}
                                >
                                  <div className="kanban-card-header">
                                    <div>
                                      <div className="title">
                                        {patient.name}
                                      </div>
                                      <div className="text-muted small">
                                        {patient.details.phone}
                                      </div>
                                    </div>
                                    <span className="id-badge">
                                      ID: {patient.id}
                                    </span>
                                  </div>
                                  <div className="kanban-card-body">
                                    <div className="info-line">
                                      <i className="bi bi-info-circle-fill"></i>
                                      <span>{lastHistory?.text}</span>
                                    </div>
                                    <div className="info-line">
                                      <i className="bi bi-bookmark-star-fill"></i>
                                      <span>Manba: {patient.source}</span>
                                    </div>
                                    <div className="info-line">
                                      <i className="bi bi-exclamation-diamond-fill"></i>
                                      <span>
                                        Keyingi qadam:{" "}
                                        {getNextStepText(patient.stageId)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="kanban-card-footer">
                                    <span
                                      className={`badge text-bg-${tag.color}`}
                                    >
                                      {tag.text}
                                    </span>
                                    <span className="date">
                                      {formatDate(lastHistory?.date)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center text-muted p-5">
                              <i className="bi bi-moon-stars fs-2"></i>
                              <p className="mt-2">Bemorlar yo'q</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </main>
        </div>
        {isSidebarToggled && (
          <div
            className="mobile-overlay"
            onClick={() => setSidebarToggled(false)}
          ></div>
        )}
      </div>

      <div className="toast-container position-fixed top-0 end-0 p-3"></div>

      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="patientDetailsOffcanvas"
        style={{ width: "600px" }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">{selectedPatient?.name}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setSelectedPatient(null)}
          ></button>
        </div>
        <div className="offcanvas-body">
          {selectedPatient && (
            <>
              <div className="details-card">
                <div className="details-card-header">
                  <h6>
                    <i className="bi bi-person-badge me-2"></i>Shaxsiy
                    ma'lumotlar
                  </h6>
                  {editingSection !== "personal" ? (
                    <button
                      className="btn btn-sm btn-outline-primary border-0"
                      onClick={() => handleStartEditing("personal")}
                    >
                      <i className="bi bi-pencil"></i> Tahrirlash
                    </button>
                  ) : (
                    <div>
                      <button
                        className="btn btn-sm btn-success border-0"
                        onClick={handleSaveDetails}
                      >
                        <i className="bi bi-check-lg"></i> Saqlash
                      </button>
                      <button
                        className="btn btn-sm btn-light border-0 ms-1"
                        onClick={handleCancelEditing}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  )}
                </div>
                <div className="details-card-body">
                  {editingSection === "personal" && editingPatientDetails ? (
                    <>
                      <div className="details-info-item">
                        <span className="label">Pasport</span>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="passport"
                          value={editingPatientDetails.passport}
                          onChange={handleDetailChange}
                        />
                      </div>
                      <div className="details-info-item">
                        <span className="label">Tug'ilgan sana</span>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          name="dob"
                          value={editingPatientDetails.dob}
                          onChange={handleDetailChange}
                        />
                      </div>
                      <div className="details-info-item">
                        <span className="label">Jins</span>
                        <select
                          className="form-select form-select-sm"
                          name="gender"
                          value={editingPatientDetails.gender}
                          onChange={handleDetailChange}
                        >
                          <option>Tanlang...</option>
                          <option value="Erkak">Erkak</option>
                          <option value="Ayol">Ayol</option>
                        </select>
                      </div>
                      <div className="details-info-item">
                        <span className="label">Telefon</span>
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          name="phone"
                          value={editingPatientDetails.phone}
                          onChange={handleDetailChange}
                        />
                      </div>
                      <div className="details-info-item">
                        <span className="label">Pochta</span>
                        <input
                          type="email"
                          className="form-control form-control-sm"
                          name="email"
                          value={editingPatientDetails.email}
                          onChange={handleDetailChange}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="details-info-item">
                        <span className="label">Pasport</span>
                        <span className="value">
                          {selectedPatient.details.passport}
                        </span>
                      </div>
                      <div className="details-info-item">
                        <span className="label">Tug'ilgan sana</span>
                        <span className="value">
                          {selectedPatient.details.dob}
                        </span>
                      </div>
                      <div className="details-info-item">
                        <span className="label">Jins</span>
                        <span className="value">
                          {selectedPatient.details.gender}
                        </span>
                      </div>
                      <div className="details-info-item">
                        <span className="label">Telefon</span>
                        <span className="value">
                          {selectedPatient.details.phone}
                        </span>
                      </div>
                      <div className="details-info-item">
                        <span className="label">Pochta</span>
                        <span className="value">
                          {selectedPatient.details.email}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="details-card">
                <div className="details-card-header">
                  <h6>
                    <i className="bi bi-heart-pulse me-2"></i>Tibbiy ma'lumotlar
                  </h6>
                  {editingSection !== "medical" ? (
                    <button
                      className="btn btn-sm btn-outline-primary border-0"
                      onClick={() => handleStartEditing("medical")}
                    >
                      <i className="bi bi-pencil"></i> Tahrirlash
                    </button>
                  ) : (
                    <div>
                      <button
                        className="btn btn-sm btn-success border-0"
                        onClick={handleSaveDetails}
                      >
                        <i className="bi bi-check-lg"></i> Saqlash
                      </button>
                      <button
                        className="btn btn-sm btn-light border-0 ms-1"
                        onClick={handleCancelEditing}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  )}
                </div>
                <div className="details-card-body">
                  {editingSection === "medical" && editingPatientDetails ? (
                    <>
                      <div className="details-info-item">
                        <span className="label w-25">Shikoyatlar</span>
                        <textarea
                          className="form-control form-control-sm"
                          name="complaints"
                          value={editingPatientDetails.complaints}
                          onChange={handleDetailChange}
                        ></textarea>
                      </div>
                      <div className="details-info-item">
                        <span className="label w-25">Avvalgi tashxis</span>
                        <textarea
                          className="form-control form-control-sm"
                          name="previousDiagnosis"
                          value={editingPatientDetails.previousDiagnosis}
                          onChange={handleDetailChange}
                        ></textarea>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="details-info-item">
                        <span className="label">Shikoyatlar</span>
                        <span className="value text-end">
                          {selectedPatient.details.complaints}
                        </span>
                      </div>
                      <div className="details-info-item">
                        <span className="label">Avvalgi tashxis</span>
                        <span className="value text-end">
                          {selectedPatient.details.previousDiagnosis}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="details-card">
                <div className="details-card-header">
                  <h6>
                    <i className="bi bi-tag me-2"></i>Holat
                  </h6>
                </div>
                <div className="details-card-body">
                  <select
                    className="form-select"
                    value={selectedPatient.tagId}
                    onChange={handleTagChangeInDetails}
                  >
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.id}>
                        {tag.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="details-card">
                <div className="details-card-header">
                  <h6>
                    <i className="bi bi-clock-history me-2"></i>Tarix
                  </h6>
                </div>
                <div className="details-card-body">
                  {selectedPatient.history
                    .slice()
                    .reverse()
                    .map((item, index) => (
                      <div className="timeline-item" key={index}>
                        <div className="fw-bold">{item.text}</div>
                        <div className="small text-muted">
                          {item.author} - {formatDate(item.date)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="mt-4">
                <button
                  className="btn btn-outline-danger w-100"
                  onClick={() => setPatientToDelete(selectedPatient)}
                >
                  <i className="bi bi-trash me-2"></i>Bemorni o'chirish
                </button>
              </div>
            </>
          )}
        </div>
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
          <p>Bu yerda filtrlar bo'ladi...</p>
        </div>
      </div>
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
              <div className="wizard-progress">
                <div
                  className="wizard-progress-bar"
                  style={{ width: `${((wizardStep - 1) / 2) * 100}%` }}
                ></div>
                <div
                  className={`wizard-progress-step ${
                    wizardStep >= 1 ? "active" : ""
                  }`}
                >
                  <div className="step-icon">1</div>
                  <div className="step-label">Shaxsiy</div>
                </div>
                <div
                  className={`wizard-progress-step ${
                    wizardStep >= 2 ? "active" : ""
                  }`}
                >
                  <div className="step-icon">2</div>
                  <div className="step-label">Tibbiy</div>
                </div>
                <div
                  className={`wizard-progress-step ${
                    wizardStep >= 3 ? "active" : ""
                  }`}
                >
                  <div className="step-icon">3</div>
                  <div className="step-label">Hujjatlar</div>
                </div>
              </div>
              <form id="new-patient-form" onSubmit={(e) => e.preventDefault()}>
                <div
                  className={`wizard-step ${wizardStep === 1 ? "active" : ""}`}
                >
                  <h6 className="mb-3">Shaxsiy ma'lumotlar</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Ism-familiya</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Pasport</label>
                      <input
                        type="text"
                        name="passport"
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Tug'ilgan sana</label>
                      <input type="date" name="dob" className="form-control" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Jins</label>
                      <select name="gender" className="form-select">
                        <option>Tanlang...</option>
                        <option value="Erkak">Erkak</option>
                        <option value="Ayol">Ayol</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Telefon</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Pochta</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`wizard-step ${wizardStep === 2 ? "active" : ""}`}
                >
                  <h6 className="mb-3">Tibbiy ma'lumotlar</h6>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Shikoyatlar</label>
                      <textarea
                        name="complaints"
                        className="form-control"
                        rows={4}
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Avvalgi tashxis</label>
                      <input
                        type="text"
                        name="diagnosis"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`wizard-step ${wizardStep === 3 ? "active" : ""}`}
                >
                  <h6 className="mb-3">Hujjatlarni yuklash</h6>
                  <input
                    className="form-control"
                    type="file"
                    multiple
                    onChange={(e) =>
                      setNewPatientFiles(Array.from(e.target.files || []))
                    }
                  />
                  <div id="new-patient-file-list" className="mt-2">
                    {newPatientFiles.map((file, i) => (
                      <div key={i} className="file-item">
                        <span>{file.name}</span>{" "}
                        <span>({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ))}
                  </div>
                  <div className="form-check mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="form-agreement"
                      required
                    />
                    <label
                      className="form-check-label"
                      htmlFor="form-agreement"
                    >
                      Men kiritgan barcha ma'lumotlarning to'g'riligini
                      tasdiqlayman.
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                onClick={handleWizardBack}
                style={{ display: wizardStep > 1 ? "inline-block" : "none" }}
              >
                Orqaga
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleWizardNext}
              >
                {wizardStep === 3 ? "Tasdiqlash va Yuborish" : "Keyingisi"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="stageChangeCommentModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Bosqichni O'zgartirish</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setPatientToMove(null)}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Bemor{" "}
                <strong>
                  {
                    patients.find((p) => p.id === patientToMove?.patientId)
                      ?.name
                  }
                </strong>{" "}
                uchun yangi bosqich:{" "}
                <strong>
                  {
                    stages.find((s) => s.id === patientToMove?.newStageId)
                      ?.title
                  }
                </strong>
              </p>
              <div className="mb-3">
                <label htmlFor="stage-change-comment" className="form-label">
                  Izoh (majburiy)
                </label>
                <textarea
                  className="form-control"
                  id="stage-change-comment"
                  rows={3}
                  value={stageChangeComment}
                  onChange={(e) => setStageChangeComment(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPatientToMove(null)}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={confirmStageChange}
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
              <ul className="list-group mb-4">
                {tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span className={`badge text-bg-${tag.color}`}>
                      {tag.text}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-danger border-0"
                      onClick={() => handleDeleteTag(tag.id)}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
              <h6>Yangi Holat Qo'shish</h6>
              <div className="input-group">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="form-control"
                  placeholder="Yangi holat nomi..."
                />
                <select
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="form-select flex-grow-0 w-auto"
                >
                  <option value="success">Yashil</option>
                  <option value="warning">Sariq</option>
                  <option value="danger">Qizil</option>
                  <option value="primary">Ko'k</option>
                  <option value="secondary">Kulrang</option>
                </select>
                <button className="btn btn-primary" onClick={handleAddNewTag}>
                  Qo'shish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="deleteConfirmModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tasdiqlash</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setPatientToDelete(null)}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Rostdan ham <strong>{patientToDelete?.name}</strong> ismli
                bemorni o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setPatientToDelete(null)}
              >
                Yo'q
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDeletePatient}
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
