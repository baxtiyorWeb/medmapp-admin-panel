// components/KanbanBoard.js
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Sortable, { SortableEvent } from "sortablejs"; // 🔑 default import
import { Offcanvas, Modal, Toast } from "bootstrap";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { get, isArray } from "lodash";

// Data interfaces
interface Tag {
  id: number;
  text: string;
  color: string;
}

interface HistoryItem {
  date: string;
  author: string;
  text: string;
}

interface Document {
  name: string;
  url: string;
}

interface PatientDetails {
  passport?: string;
  dob?: string;
  gender?: string;
  phone: string;
  email?: string;
  complaints?: string;
  previousDiagnosis?: string;
  documents?: Document[];
}

interface Patient {
  id: number;
  name: string;
  tagId: number;
  stageId: string;
  source: string;
  createdBy: string;
  history: HistoryItem[];
  details: PatientDetails;
}

interface Stage {
  id: string;
  title: string;
  colorClass: string;
}

// Initial Data
const initialStages: Stage[] = [
  { id: "stage1", title: "Yangi", colorClass: "kanban-column-new" },
  { id: "stage2", title: "Hujjatlar", colorClass: "kanban-column-docs" },
  { id: "stage3", title: "To'lov", colorClass: "kanban-column-payment" },
  { id: "stage4", title: "Safar", colorClass: "kanban-column-trip" },
  { id: "stage5", title: "Arxiv", colorClass: "kanban-column-archive" },
];

const initialTags: Tag[] = [
  { id: 1, text: "Normal", color: "success" },
  { id: 2, text: "VIP", color: "warning" },
  { id: 3, text: "Shoshilinch", color: "danger" },
];

const initialPatients: Patient[] = [
  {
    id: 1,
    name: "Shohjahon Mirakov",
    tagId: 3,
    stageId: "stage1",
    source: "Facebook",
    createdBy: "Operator #2",
    history: [
      {
        date: "2025-08-11T11:35:00",
        author: "Tizim",
        text: "Bemor profili yaratildi.",
      },
    ],
    details: {
      passport: "AA1234567",
      dob: "1985-05-15",
      gender: "Erkak",
      phone: "+998 90 123 45 67",
      email: "shohjahon.m@gmail.com",
      complaints: "Yurak sohasidagi og'riq, hansirash.",
      previousDiagnosis: "Gipertoniya",
      documents: [
        { name: "Pasport nusxasi.pdf", url: "#" },
        { name: "EKG natijasi.jpg", url: "#" },
      ],
    },
  },
  {
    id: 2,
    name: "Sarvinoz Karimova",
    tagId: 2,
    stageId: "stage1",
    source: "Sayt",
    createdBy: "Admin",
    history: [
      {
        date: "2025-08-10T11:35:00",
        author: "Tizim",
        text: "Bemor profili yaratildi.",
      },
    ],
    details: {
      passport: "AB7654321",
      dob: "1992-11-20",
      gender: "Ayol",
      phone: "+998 91 234 56 78",
      email: "sarvinoz.k@mail.com",
      complaints: "Bosh og'rig'i, uyqusizlik.",
      previousDiagnosis: "Migren",
      documents: [],
    },
  },
  {
    id: 3,
    name: "John Doe",
    tagId: 1,
    stageId: "stage2",
    source: "Tavsiya",
    createdBy: "Operator #1",
    history: [
      {
        date: "2025-08-02T10:00:00",
        author: "Tizim",
        text: "Bemor profili yaratildi.",
      },
      {
        date: "2025-08-04T11:35:00",
        author: "Operator #1",
        text: "Hujjatlar to'liq yig'ildi va klinikaga yuborishga tayyor.",
      },
    ],
    details: {
      passport: "US12345678",
      dob: "1978-01-30",
      gender: "Erkak",
      phone: "+1-202-555-0149",
      email: "j.doe@example.com",
      complaints: "Umumiy holsizlik, vazn yo'qotish.",
      previousDiagnosis: "Kiritilmagan",
      documents: [
        { name: "Biopsy_results.pdf", url: "#" },
        { name: "PET-CT_scan.zip", url: "#" },
      ],
    },
  },
];

// Helper Functions
const getNextStepText = (stageId: string): string => {
  const nextSteps: Record<string, string> = {
    stage1: "Hujjatlarni so'rash",
    stage2: "Klinika tanlash",
    stage3: "To'lovni qabul qilish",
    stage4: "Safar sanasini belgilash",
    stage5: "Yopilgan",
  };
  return nextSteps[stageId] || "Noma'lum";
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const time = date.toTimeString().slice(0, 5);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${time} | ${day}.${month}.${year}`;
};

const KanbanBoard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [tempMoveData, setTempMoveData] = useState<{
    patientId: number;
    newStageId: string;
  } | null>(null);

  // Modals va Offcanvas uchun state
  const [offcanvas, setOffcanvas] = useState<Offcanvas | null>(null);
  const [commentModal, setCommentModal] = useState<Modal | null>(null);
  const [deleteModal, setDeleteModal] = useState<Modal | null>(null);

  // Toast funksiyasini qayta ishlatish uchun
  const showToast = useCallback((message: string, type: string = "success") => {
    // Sizning original kodingizdagi DOMga toast qo'shish logikasi
    const toastContainer = document.getElementById("toast-container");
    const toastEl = document.createElement("div");
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastEl.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
    toastContainer?.appendChild(toastEl);
    const toast = new Toast(toastEl);
    toast.show();
    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
  }, []);

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await api.get("/auth/users/"),
  });
  const usersItems = isArray(data?.data) ? get(data, "data", []) : [];
  // Bemor ma'lumotlarini tahrirlash rejimiga o'tish
  const toggleEditMode = (
    cardType: "personal" | "medical",
    isEditing: boolean
  ) => {
    if (cardType === "personal") {
      setIsEditingPersonal(isEditing);
    } else {
      setIsEditingMedical(isEditing);
    }
  };

  // Bemor ma'lumotlarini saqlash
  const savePatientDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    // input elementlaridan ma'lumotlarni yig'ib olish
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const updatedDetails: PatientDetails = {
      ...activePatient.details,
      phone: formData.get("edit-phone") as string,
    };

    if (isEditingPersonal) {
      updatedDetails.passport = formData.get("edit-passport") as string;
      updatedDetails.dob = formData.get("edit-dob") as string;
      updatedDetails.gender = formData.get("edit-gender") as string;
      updatedDetails.email = formData.get("edit-email") as string;
    }

    if (isEditingMedical) {
      updatedDetails.complaints = formData.get("edit-complaints") as string;
      updatedDetails.previousDiagnosis = formData.get(
        "edit-diagnosis"
      ) as string;
    }

    setPatients((prev) =>
      prev.map((p) =>
        p.id === activePatient.id ? { ...p, details: updatedDetails } : p
      )
    );
    setActivePatient({ ...activePatient, details: updatedDetails });

    setIsEditingPersonal(false);
    setIsEditingMedical(false);
    showToast("Ma'lumotlar saqlandi");
  };

  // Bemor holatini (tag) o'zgartirish
  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!activePatient) return;
    const newTagId = parseInt(e.target.value);
    setPatients((prev) =>
      prev.map((p) =>
        p.id === activePatient.id ? { ...p, tagId: newTagId } : p
      )
    );
    setActivePatient({ ...activePatient, tagId: newTagId });
    showToast("Holat o'zgartirildi");
  };

  // Bemorni o'chirish
  const deletePatient = () => {
    if (!activePatient) return;
    setPatients((prev) => prev.filter((p) => p.id !== activePatient.id));
    deleteModal?.hide();
    offcanvas?.hide();
    showToast("Bemor muvaffaqiyatli o'chirildi.", "warning");
  };

  // Kanban kartochkalarini bosish
  const openPatientDetails = (patientId: number) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;
    setActivePatient(patient);
    setIsEditingPersonal(false);
    setIsEditingMedical(false);
    offcanvas?.show();
  };

  // Bosqich o'zgarishi uchun izoh qo'shish
  const handleCommentSubmit = () => {
    if (!commentText.trim() || !tempMoveData) {
      showToast("Iltimos, izoh yozing!", "danger");
      return;
    }

    const { patientId, newStageId } = tempMoveData;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          const newHistory = [
            ...p.history,
            {
              date: new Date().toISOString(),
              author: "Operator #1", // Bu dinamik bo'lishi kerak
              text: commentText,
            },
          ];
          return { ...p, stageId: newStageId, history: newHistory };
        }
        return p;
      })
    );
    setCommentText("");
    setTempMoveData(null);
    commentModal?.hide();
    showToast("Bosqich muvaffaqiyatli o'zgartirildi");
  };

  // Sortablejs ni useEffect orqali ishga tushirish
  useEffect(() => {
    const kanbanContainers = document.querySelectorAll(".kanban-cards");
    kanbanContainers.forEach((container) => {
      new Sortable(container as HTMLElement, {
        group: "kanban",
        animation: 400, // 400ms – sekinroq animatsiya
        easing: "cubic-bezier(0.25, 0.8, 0.25, 1)", // silliq ease-in-out effekt
        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        onEnd: (evt: SortableEvent) => {
          if (evt.from === evt.to) return;
          const patientId = parseInt(evt.item.dataset.id || "0");
          const newStageId = evt.to.dataset.stageId;

          if (patientId && newStageId) {
            const patient = patients.find((p) => p.id === patientId);
            const newStage = stages.find((s) => s.id === newStageId);
            if (patient && newStage) {
              setTempMoveData({ patientId, newStageId });
              document.getElementById("comment-patient-name")!.textContent =
                patient.name;
              document.getElementById("comment-new-stage")!.textContent =
                newStage.title;
              commentModal?.show();
            }
          }
        },
      });
    });
  }, [patients, commentModal, stages]);

  // Bootstrap modallarini bir marta yaratish
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOffcanvas(
        new Offcanvas(
          document.getElementById("patientDetailsOffcanvas") as HTMLElement
        )
      );
      setCommentModal(
        new Modal(
          document.getElementById("stageChangeCommentModal") as HTMLElement
        )
      );
      setDeleteModal(
        new Modal(document.getElementById("deleteConfirmModal") as HTMLElement)
      );
    }
  }, []);

  return (
    <>
      <div className="kanban-wrapper">
        <div className="kanban-board" id="kanban-board">
          {stages.map((stage) => {
            const patientsInStage = patients.filter(
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
                      const tag = tags.find((t) => t.id === patient.tagId) || {
                        text: "Noma'lum",
                        color: "secondary",
                      };
                      const lastHistory =
                        patient.history[patient.history.length - 1];
                      return (
                        <div
                          key={patient.id}
                          className="kanban-card"
                          data-id={patient.id}
                          onClick={() => openPatientDetails(patient.id)}
                        >
                          <div className="kanban-card-header">
                            <div>
                              <div className="title">{patient.name}</div>
                              <div className="text-muted small">
                                {patient.details.phone}
                              </div>
                            </div>
                            <span className="id-badge">ID: {patient.id}</span>
                          </div>
                          <div className="kanban-card-body">
                            <div className="info-line">
                              <i className="bi bi-info-circle-fill"></i>
                              <span>{lastHistory.text}</span>
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
                            <span className={`badge text-bg-${tag.color}`}>
                              {tag.text}
                            </span>
                            <span className="date">
                              {formatDate(lastHistory.date)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-muted p-5">
                      <i className="bi bi-moon-stars fs-2"></i>
                      <p className="mt-2">Bemorlar yo&apos;q</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Offcanvas for Patient Details (Bu yerda React komponenti sifatida render qilinadi) */}
      {activePatient && (
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="patientDetailsOffcanvas"
          aria-labelledby="patientDetailsOffcanvasLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="patientDetailsOffcanvasLabel">
              <i className="bi bi-person-fill-gear me-2"></i>Bemor
              ma&apos;lumotlari: {activePatient.name}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            {/* ... Offcanvas ichidagi HTML ... */}
          </div>
        </div>
      )}

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
      <div
        id="toast-container"
        className="toast-container position-fixed bottom-0 end-0 p-3"
      ></div>
    </>
  );
};

export default KanbanBoard;
