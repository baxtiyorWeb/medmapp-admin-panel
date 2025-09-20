"use client";

import React, { useState, useEffect, useRef, useMemo, Fragment } from "react";
import {
  Patient,
  Stage,
  Tag,
} from "../../lib/data";
import Sortable from "sortablejs";
import { Dialog, Transition } from "@headlessui/react";
import api from "@/utils/api";
import { AxiosError } from "axios";

type ToastMessage = {
  id: number;
  message: string;
  type: "success" | "danger" | "warning";
};

export default function OperatorPageClient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingSection, setEditingSection] = useState<"personal" | "medical" | null>(null);
  const [editingPatientDetails, setEditingPatientDetails] = useState<Patient["details"] | null>(null);
  type PatientToMove = { patientId: number; newStageId: string } | null;
  const [patientToMove, setPatientToMove] = useState<PatientToMove>(null);
  const [stageChangeComment, setStageChangeComment] = useState("");
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [newPatientFiles, setNewPatientFiles] = useState<File[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("success");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const kanbanBoardRef = useRef<HTMLDivElement>(null);
  const newPatientFormRef = useRef<HTMLFormElement>(null);

  const showToast = (message: string, type: "success" | "danger" | "warning" = "success") => {
    const newToast: ToastMessage = { id: Date.now(), message, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
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
      "1": "Hujjatlarni so'rash",
      "2": "Klinika tanlash",
    };
    return nextSteps[stageId] || "Noma'lum";
  };

  const handleOpenNewPatientModal = () => {
    setWizardStep(1);
    setNewPatientFiles([]);
    newPatientFormRef.current?.reset();
    setIsNewPatientModalOpen(true);
  };

  const handleClosePatientDetails = () => {
    setSelectedPatient(null);
  };

  const filteredPatients = useMemo(
    () => patients.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [patients, searchTerm]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsResponse, stagesResponse, tagsResponse] = await Promise.all([
          api.get("patients/"),
          api.get("patients/stages/"),
          api.get("patients/tags/"),
        ]);

        const { data: patientsData } = patientsResponse;
        const { data: stagesData } = stagesResponse;
        const { data: tagsData } = tagsResponse;

        // Stages mapping
        setStages(
          (stagesData.results || []).map((s: { code_name: string, title: string, color: string }) => ({
            id: s.code_name,
            title: s.title,
            colorClass: `border-${s.color === "#123" ? "gray" : s.color}-600`, // #123 uchun fallback
          }))
        );

        // Patients mapping - stageId ni birinchi stage ga (1) belgilaymiz, chunki stage ma'lumoti yo'q
        setPatients(
          (patientsData.results || []).map((p: Patient) => ({
            id: p.id,
            name: p.full_name,
            tagId: p.tag || 1,
            stageId: "1", // Hamma patientni birinchi stage ga qo'yamiz, chunki stage ma'lumoti yo'q
            phone: p.phone || "",
            source: p.source || "Anketa",
            createdBy: "Noma'lum",
            lastUpdatedAt: p.updated_at,
            history: [],
            details: {
              phone: p.phone || "",
              email: p.email || "",
              passport: "",
              dob: "",
              gender: "Erkak",
              complaints: "",
              previousDiagnosis: "",
              documents: p.avatar_url ? [{ name: "avatar.png", url: p.avatar_url }] : [],
            },
          }))
        );

        // Tags mapping
        setTags(
          (tagsData.results || []).map((t: { id: number, name: string, color: string }) => ({
            id: t.id,
            text: t.name,
            color: t.color === "#a81a1a" ? "danger" : t.color, // Hex uchun fallback
          }))
        );
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error);
        showToast("Ma'lumotlarni yuklashda xatolik yuz berdi", "danger");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!kanbanBoardRef.current) return;
    const containers = Array.from(kanbanBoardRef.current.querySelectorAll(".kanban-cards"));
    const sortableInstances: Sortable[] = [];
    containers.forEach((container) => {
      sortableInstances.push(
        new Sortable(container as HTMLElement, {
          group: "kanban",
          animation: 150,
          ghostClass: "sortable-ghost",
          onEnd: (evt) => {
            const originalItem = evt.item;
            const originalList = evt.from;
            const originalIndex = evt.oldDraggableIndex;

            if (originalIndex !== undefined) {
              originalList.insertBefore(originalItem, originalList.children[originalIndex]);
            }

            if (evt.from !== evt.to) {
              setPatientToMove({
                patientId: parseInt(originalItem.dataset.id!),
                newStageId: evt.to.dataset.stageId!,
              });
            }
          },
        })
      );
    });
    return () => sortableInstances.forEach((instance) => instance.destroy());
  }, [filteredPatients]);

  const handleStartEditing = (section: "personal" | "medical") => {
    if (!selectedPatient) return;
    setEditingSection(section);
    setEditingPatientDetails(JSON.parse(JSON.stringify(selectedPatient.details)));
  };

  const handleCancelEditing = () => {
    setEditingSection(null);
    setEditingPatientDetails(null);
  };

  const handleSaveDetails = async () => {
    if (!selectedPatient || !editingPatientDetails) return;

    try {
      const { data: updatedPatientData } = await api.patch(`patients/${selectedPatient.id}/`, {
        full_name: selectedPatient.name,
        phone: editingPatientDetails.phone,
        email: editingPatientDetails.email,
      });

      setPatients((prev) =>
        prev.map((p) =>
          p.id === selectedPatient.id
            ? {
              ...p,
              name: updatedPatientData.full_name,
              details: {
                ...p.details,
                ...updatedPatientData,
              },
            }
            : p
        )
      );
      setSelectedPatient({
        ...selectedPatient,
        name: updatedPatientData.full_name,
        details: {
          ...selectedPatient.details,
          ...updatedPatientData,
        },
      });
      handleCancelEditing();
      showToast("Ma'lumotlar saqlandi");
    } catch (error) {
      showToast("Ma'lumotlarni saqlashda xatolik yuz berdi", "danger");
    }
  };

  const handleDetailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!editingPatientDetails) return;
    setEditingPatientDetails((prev) =>
      prev ? { ...prev, [e.target.name]: e.target.value } : null
    );
  };

  const handleTagChangeInDetails = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTagId = parseInt(e.target.value);
    if (!selectedPatient) return;

    try {
      const { data: updatedPatientData } = await api.patch(`patients/${selectedPatient.id}/`, {
        tag: newTagId,
      });

      setPatients((prev) =>
        prev.map((p) =>
          p.id === selectedPatient.id
            ? {
              ...p,
              tagId: updatedPatientData.tag,
            }
            : p
        )
      );
      setSelectedPatient({
        ...selectedPatient,
        tagId: updatedPatientData.tag,
      });
      showToast("Holat o'zgartirildi");
    } catch (error) {
      showToast("Holatni o'zgartirishda xatolik yuz berdi", "danger");
    }
  };

  const confirmStageChange = async () => {
    if (!patientToMove || !stageChangeComment.trim()) {
      showToast("Iltimos, izoh yozing!", "danger");
      return;
    }

    try {
      await api.patch(`patients/${patientToMove.patientId}/change-stage/`, {
        new_stage_id: patientToMove.newStageId,
        comment: stageChangeComment,
      });

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
    } catch (error) {
      showToast("Bosqichni o'zgartirishda xatolik yuz berdi", "danger");
    }
  };

  const confirmDeletePatient = async () => {
    if (!patientToDelete) return;

    try {
      await api.delete(`patients/${patientToDelete.id}/`);

      setPatients((prev) => prev.filter((p) => p.id !== patientToDelete.id));
      showToast("Bemor muvaffaqiyatli o'chirildi.", "warning");
      setPatientToDelete(null);
      setSelectedPatient(null);
    } catch (error) {
      showToast("Bemorni o'chirishda xatolik yuz berdi", "danger");
    }
  };

  const handleCreatePatient = async (
    newPatientData: Omit<Patient, "id" | "history" | "lastUpdatedAt">,
    files: File[]
  ) => {
    try {
      const createResponse = await api.post("patients/create/", {
        full_name: newPatientData.name,
        phone: newPatientData.details.phone,
        email: newPatientData.details.email,
        source: newPatientData.source,
      });

      const createdPatient = createResponse.data;

      if (files.length > 0) {
        try {
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("documents", file);
          });

          await api.post(`patients/${createdPatient.id}/documents/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (fileUploadError) {
          console.warn("Fayllarni yuklashda xatolik:", fileUploadError);
        }
      }

      const updateData = {
        details: {
          ...newPatientData.details,
          passport: newPatientData.details.passport,
          dob: newPatientData.details.dob,
          gender: newPatientData.details.gender,
          complaints: newPatientData.details.complaints,
          previous_diagnosis: newPatientData.details.previousDiagnosis,
        },
        tag: newPatientData.tagId,
        stage: newPatientData.stageId,
        created_by: newPatientData.createdBy,
      };

      await api.patch(`patients/${createdPatient.id}/`, updateData);

      const newPatient: Patient = {
        ...newPatientData,
        id: createdPatient.id,
        history: [],
        lastUpdatedAt: new Date().toISOString(),
        details: {
          ...newPatientData.details,
          documents: files.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
        },
      };

      setPatients((prev) => [newPatient, ...prev]);
      showToast(`${newPatientData.name} ismli bemor muvaffaqiyatli qo'shildi!`, "success");
    } catch (error: unknown) {
      console.error("Bemor yaratishda xatolik:", error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const errorMessage =
            error.response.data?.full_name?.[0] ||
            error.response.data?.phone?.[0] ||
            "Noto'g'ri ma'lumotlar";
          showToast(errorMessage, "danger");
        } else if (error.response?.status === 409) {
          showToast("Bu telefon raqami bilan bemor allaqachon ro'yxatdan o'tgan", "warning");
        } else {
          showToast("Bemor qo'shishda xatolik yuz berdi. Qaytadan urinib ko'ring.", "danger");
        }
      } else {
        showToast("Kutilmagan xatolik yuz berdi.", "danger");
      }

      throw error;
    }
  };

  const handleWizardNext = async () => {
    if (wizardStep < 3) {
      if (wizardStep === 1) {
        const form = newPatientFormRef.current;
        if (!form) return;

        const formData = new FormData(form);
        const name = formData.get("name")?.toString().trim();
        const phone = formData.get("phone")?.toString().trim();

        if (!name || !phone) {
          showToast("Ism va Telefon maydonlari majburiy!", "danger");
          return;
        }
      }
      setWizardStep(wizardStep + 1);
      return;
    }

    const form = newPatientFormRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();

    if (!name || !phone) {
      showToast("Ism va Telefon maydonlari majburiy!", "danger");
      setWizardStep(1);
      return;
    }

    const newPatientData: Omit<Patient, "id" | "history" | "lastUpdatedAt"> = {
      name,
      tagId: 1,
      stageId: "1", // Yangi patientni birinchi stage ga qo'yamiz
      source: "Anketa",
      createdBy: "Operator #1",
      phone,
      details: {
        passport: formData.get("passport")?.toString() || "",
        dob: formData.get("dob")?.toString() || "",
        gender: formData.get("gender")?.toString() || "Erkak",
        phone,
        email: formData.get("email")?.toString() || "",
        complaints: formData.get("complaints")?.toString() || "",
        previousDiagnosis: formData.get("diagnosis")?.toString() || "",
        documents: [],
      },
    };

    try {
      await handleCreatePatient(newPatientData, newPatientFiles);
      setIsNewPatientModalOpen(false);
    } catch (error) {
      // Error is handled in handleCreatePatient
    }
  };

  const handleWizardBack = () => {
    if (wizardStep > 1) setWizardStep(wizardStep - 1);
  };

  const handleAddNewTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const { data: newTag } = await api.post("tags/", {
        name: newTagName,
        color: newTagColor,
      });

      setTags((prev) => [...prev, { id: newTag.id, text: newTag.name, color: newTag.color }]);
      setNewTagName("");
      showToast("Yangi holat qo'shildi");
    } catch (error) {
      showToast("Yangi holat qo'shishda xatolik yuz berdi", "danger");
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    try {
      await api.delete(`patients/tags/${tagId}/`);

      setTags((prev) => prev.filter((t) => t.id !== tagId));
      showToast("Holat o'chirildi", "warning");
    } catch (error) {
      showToast("Holatni o'chirishda xatolik yuz berdi", "danger");
    }
  };

  const getTagColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      success: "bg-green-100 text-green-700 ring-1 ring-green-200",
      warning: "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200",
      danger: "bg-red-100 text-red-700 ring-1 ring-red-200",
      primary: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
      secondary: "bg-gray-100 text-gray-700 ring-1 ring-gray-200",
    };
    return colorMap[color] || colorMap.secondary;
  };

  const getToastColorClasses = (type: string) => {
    const colorMap: { [key: string]: string } = {
      success: "bg-green-500 text-white ring-1 ring-green-600/20 shadow-green-500/20",
      danger: "bg-red-500 text-white ring-1 ring-red-600/20 shadow-red-500/20",
      warning: "bg-yellow-500 text-gray-900 ring-1 ring-yellow-600/20 shadow-yellow-500/20",
    };
    return colorMap[type];
  };

  // Qolgan JSX kodlarini avvalgi holatida saqlaymiz, faqat Kanban boardni tekshirish uchun log qo'shamiz
  return (
    <>
      <style jsx global>{`
        .sortable-ghost {
          background: #f8fafc;
          border: 2px dashed #3b82f6;
          opacity: 0.6;
          border-radius: 0.75rem;
        }
      `}</style>

      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[100] space-y-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between w-full max-w-sm p-4 rounded-xl shadow-xl ring-1 ${getToastColorClasses(toast.type)}`}
          >
            <div className="text-sm font-medium">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-4 flex-shrink-0 h-6 w-6 rounded-full p-1 inline-flex items-center justify-center hover:bg-white/10 focus:outline-none transition"
            >
              <i className="bi bi-x text-base"></i>
            </button>
          </div>
        ))}
      </div>

      <section className="p-6 bg-[var(--card-background)] min-h-screen antialiased md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:mb-8 md:gap-6">
          <div className="w-full md:w-auto">
            <h1 className="text-3xl font-bold text-[var(--text-color)] tracking-tight md:text-4xl">
              Boshqaruv Paneli
            </h1>
          </div>
          <div className="w-full md:w-auto flex flex-wrap items-center justify-start md:justify-end gap-4">
            <div className="relative flex-grow md:flex-grow-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <i className="bi bi-search text-lg"></i>
              </span>
              <input
                type="search"
                className="pl-12 pr-5 py-3 bg-[var(--input-bg)] text-[var(--text-color)] border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm hover:shadow-md w-full md:w-64"
                placeholder="Bemor qidirish..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="px-5 py-3 text-sm font-semibold bg-[var(--input-bg)] text-[var(--text-color)] border  border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-200 flex items-center gap-2"
              type="button"
              onClick={() => setIsFiltersOpen(true)}
            >
              <i className="bi bi-funnel text-lg"></i>
              <span className="hidden md:inline">Filtr</span>
            </button>
            <button
              className="px-5 py-3 text-sm font-semibold bg-[var(--input-bg)] text-[var(--text-color)] border  border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-200 flex items-center gap-2"
              type="button"
              onClick={() => setIsTagModalOpen(true)}
            >
              <i className="bi bi-tags text-lg"></i>
              <span className="hidden md:inline">Holatlar</span>
            </button>
            <button
              className="px-5 py-3 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-2xl shadow-md hover:shadow-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
              onClick={handleOpenNewPatientModal}
            >
              <i className="bi bi-plus-lg text-lg"></i>
              <span className="hidden md:inline">Yangi Bemor</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:gap-6 md:mb-8">
          <div className="bg-[var(--input-bg)] text-[var(--text-color)] p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex items-center gap-4 hover:-translate-y-1 md:p-6">
            <div className="p-4 rounded-full bg-blue-50 text-blue-600 shadow-sm">
              <i className="bi bi-people-fill text-3xl"></i>
            </div>
            <div>
              <p className="text-sm text-[var(--text-light)] font-medium">Jami Bitimlar</p>
              <h4 className="text-3xl font-bold text-[var(--text-color)]">{patients.length}</h4>
            </div>
          </div>
          <div className="bg-[var(--input-bg)] text-[var(--text-color)] p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex items-center gap-4 hover:-translate-y-1 md:p-6">
            <div className="p-4 rounded-full bg-green-50 text-green-600 shadow-sm">
              <i className="bi bi-person-plus-fill text-3xl"></i>
            </div>
            <div>
              <p className="text-sm text-[var(--text-light)] font-medium">Yangi Bemorlar</p>
              <h4 className="text-3xl font-bold text-[var(--text-color)]">
                {patients.filter((p) => p.stageId === "1").length}
              </h4>
            </div>
          </div>
          <div className="bg-[var(--input-bg)] text-[var(--text-color)] p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex items-center gap-4 hover:-translate-y-1 md:p-6">
            <div className="p-4 rounded-full bg-yellow-50 text-yellow-600 shadow-sm">
              <i className="bi bi-check-circle-fill text-3xl"></i>
            </div>
            <div>
              <p className="text-sm text-[var(--text-light)] font-medium">Faol Bemorlar</p>
              <h4 className="text-3xl font-bold text-[var(--text-color)]">
                {patients.filter((p) => p.stageId !== "2").length}
              </h4>
            </div>
          </div>
          <div className="bg-[var(--input-bg)] text-[var(--text-color)] p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex items-center gap-4 hover:-translate-y-1 md:p-6">
            <div className="p-4 rounded-full bg-indigo-50 text-indigo-600 shadow-sm">
              <i className="bi bi-cash-stack text-3xl"></i>
            </div>
            <div>
              <p className="text-sm text-[var(--text-light)] font-medium">Kutilayotgan Daromad</p>
              <h4 className="text-3xl font-bold text-[var(--text-color)]">$2,564</h4>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-6">
          <div
            className="grid grid-flow-col auto-cols-[300px] gap-4 min-w-max md:auto-cols-[340px] md:gap-6"
            ref={kanbanBoardRef}
          >
            {stages.map((stage) => {
              const patientsInStage = filteredPatients.filter((p) => p.stageId === stage.id);
              console.log(stages);

              return (
                <div
                  key={stage.id}
                  className="flex bg-[var(--input-bg)] text-[var(--text-color)] flex-col bg-gray-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  <div
                    className={`p-5 bg-[var(--input-bg)] text-[var(--text-color)] font-semibold text-gray-800 border-b-4 ${stage.colorClass} flex items-center justify-between`}
                  >
                    <span className="text-[var(--text-color)]">
                      {stage.title} ({patientsInStage.length})
                    </span>
                  </div>
                  <div
                    className="kanban-cards bg-[var(--input-bg)] text-[var(--text-color)] flex-grow p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]"
                    data-stage-id={stage.id}
                  >
                    {patientsInStage.length > 0 ? (
                      patientsInStage.map((patient) => {
                        const tag = tags.find((t) => t.id === patient.tagId) || {
                          color: "secondary",
                          text: "Noma'lum",
                        };
                        const lastHistory = patient.history[patient.history.length - 1];
                        return (
                          <div
                            key={patient.id}
                            className="bg-[var(--background-color)] text-[var(--text-color)] rounded-xl shadow-md p-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-300"
                            data-id={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="font-bold text-[var(--text-color)] text-lg">{patient.name}</div>
                                <div className="text-[var(--text-light)] text-sm mt-1">{patient.details.phone}</div>
                              </div>
                              <span
                                className={`text-xs text-[var(--text-light)] font-semibold px-3 py-1.5 rounded-full ${getTagColorClasses(tag.color)}`}
                              >
                                {tag.text}
                              </span>
                            </div>
                            <div className="space-y-3 text-sm text-gray-600 mb-5">
                              <div className="flex items-start gap-3">
                                <i className="bi bi-info-circle-fill text-gray-400 mt-0.5 text-base"></i>
                                <span className="text-[var(--text-light)]">{lastHistory?.text || "Hech qanday izoh"}</span>
                              </div>
                              <div className="flex items-start gap-3">
                                <i className="bi bi-exclamation-diamond-fill text-gray-400 mt-0.5 text-base"></i>
                                <span className="text-[var(--text-light)]">Keyingi qadam: {getNextStepText(patient.stageId)}</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                              <span>
                                <i className="bi bi-bookmark-star-fill mr-1.5"></i>
                                {patient.source}
                              </span>
                              <span>{formatDate(lastHistory?.date || patient.lastUpdatedAt)}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-400 p-8">
                        <i className="bi bi-moon-stars-fill text-5xl"></i>
                        <p className="mt-3 text-base font-medium">Bemorlar yo&apos;q</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Patient Details Offcanvas */}
      <Transition show={!!selectedPatient} as={Fragment}>
        <Dialog onClose={handleClosePatientDetails} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl overflow-hidden">
              {selectedPatient && (
                <>
                  <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                      {selectedPatient.name}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="p-2 rounded-full hover:bg-gray-100 transition text-gray-600 hover:text-gray-900"
                      onClick={handleClosePatientDetails}
                    >
                      <i className="bi bi-x-lg text-xl"></i>
                    </button>
                  </div>
                  <div className="p-8 overflow-y-auto h-[calc(100vh-80px)] bg-gray-50 space-y-6">
                    <div className="bg-white rounded-2xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h6 className="font-bold text-gray-800 text-lg">
                          <i className="bi bi-person-badge mr-2 text-blue-600"></i>
                          Shaxsiy ma&apos;lumotlar
                        </h6>
                        {editingSection !== "personal" ? (
                          <button
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 transition"
                            onClick={() => handleStartEditing("personal")}
                          >
                            <i className="bi bi-pencil text-base"></i> Tahrirlash
                          </button>
                        ) : (
                          <div className="flex gap-3">
                            <button
                              className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition shadow-sm"
                              onClick={handleSaveDetails}
                            >
                              <i className="bi bi-check-lg mr-1"></i> Saqlash
                            </button>
                            <button
                              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition shadow-sm"
                              onClick={handleCancelEditing}
                            >
                              <i className="bi bi-x-lg mr-1"></i> Bekor
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4 text-sm">
                        {editingSection === "personal" && editingPatientDetails ? (
                          <div className="grid grid-cols-2 gap-5">
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Pasport
                              </label>
                              <input
                                type="text"
                                name="passport"
                                value={editingPatientDetails.passport}
                                onChange={handleDetailChange}
                                className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm "
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Tug&apos;ilgan sana
                              </label>
                              <input
                                type="date"
                                name="dob"
                                value={editingPatientDetails.dob}
                                onChange={handleDetailChange}
                                className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm "
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Jins
                              </label>
                              <select
                                name="gender"
                                value={editingPatientDetails.gender}
                                onChange={handleDetailChange}
                                className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm  bg-white"
                              >
                                <option value="Erkak">Erkak</option>
                                <option value="Ayol">Ayol</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Telefon
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={editingPatientDetails.phone}
                                onChange={handleDetailChange}
                                className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm "
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Pochta
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={editingPatientDetails.email}
                                onChange={handleDetailChange}
                                className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm "
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between py-2 items-center">
                              <span className="text-gray-500 font-medium">Pasport</span>
                              <span className="font-semibold text-gray-900">
                                {selectedPatient.details.passport}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 items-center">
                              <span className="text-gray-500 font-medium">Tug&apos;ilgan sana</span>
                              <span className="font-semibold text-gray-900">
                                {selectedPatient.details.dob}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 items-center">
                              <span className="text-gray-500 font-medium">Jins</span>
                              <span className="font-semibold text-gray-900">
                                {selectedPatient.details.gender}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 items-center">
                              <span className="text-gray-500 font-medium">Telefon</span>
                              <span className="font-semibold text-gray-900">
                                {selectedPatient.details.phone}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 items-center">
                              <span className="text-gray-500 font-medium">Pochta</span>
                              <span className="font-semibold text-gray-900">
                                {selectedPatient.details.email}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h6 className="font-bold text-gray-800 text-lg">
                          <i className="bi bi-heart-pulse mr-2 text-red-600"></i>
                          Tibbiy ma&apos;lumotlar
                        </h6>
                        {editingSection !== "medical" ? (
                          <button
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 transition"
                            onClick={() => handleStartEditing("medical")}
                          >
                            <i className="bi bi-pencil text-base"></i> Tahrirlash
                          </button>
                        ) : (
                          <div className="flex gap-3">
                            <button
                              className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition shadow-sm"
                              onClick={handleSaveDetails}
                            >
                              <i className="bi bi-check-lg mr-1"></i> Saqlash
                            </button>
                            <button
                              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition shadow-sm"
                              onClick={handleCancelEditing}
                            >
                              <i className="bi bi-x-lg mr-1"></i> Bekor
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4 text-sm">
                        {editingSection === "medical" && editingPatientDetails ? (
                          <div className="space-y-5">
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Shikoyatlar
                              </label>
                              <textarea
                                name="complaints"
                                value={editingPatientDetails.complaints}
                                onChange={handleDetailChange}
                                className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm  resize-none"
                                rows={4}
                              ></textarea>
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Oldingi tashxis
                              </label>
                              <textarea
                                name="previousDiagnosis"
                                value={editingPatientDetails.previousDiagnosis}
                                onChange={handleDetailChange}
                                className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm  resize-none"
                                rows={4}
                              ></textarea>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="py-2">
                              <span className="text-gray-500 font-medium block mb-1">Shikoyatlar</span>
                              <span className="font-semibold text-gray-900">
                                {selectedPatient.details.complaints || "Yo'q"}
                              </span>
                            </div>
                            <div className="py-2">
                              <span className="text-gray-500 font-medium block mb-1">Oldingi tashxis</span>
                              <span className="font-semibold text-gray-900">
                                {selectedPatient.details.previousDiagnosis || "Yo'q"}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mt-8">
                      <button
                        className="w-full py-3 text-red-600 bg-white border border-red-200 rounded-2xl hover:bg-red-50 hover:border-red-300 transition shadow-sm hover:shadow-md font-semibold"
                        onClick={() => setPatientToDelete(selectedPatient)}
                      >
                        <i className="bi bi-trash mr-2"></i>Bemorni o&apos;chirish
                      </button>
                    </div>
                  </div>
                </>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Stage Change Modal */}
      <Transition show={!!patientToMove} as={Fragment}>
        <Dialog onClose={() => setPatientToMove(null)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
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
              <Dialog.Panel className="bg-[var(--background-color)] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)]">
                  <Dialog.Title className="font-bold text-xl text-[var(--text-color)]">
                    Bosqichni O&apos;zgartirish
                  </Dialog.Title>
                </div>
                <div className="p-6">
                  <p className="mb-5 text-gray-600 text-base">
                    Bemor{" "}
                    <strong>{patients.find((p) => p.id === patientToMove?.patientId)?.name}</strong>{" "}
                    uchun yangi bosqich:{" "}
                    <strong>{stages.find((s) => s.id === patientToMove?.newStageId)?.title}</strong>
                  </p>
                  <label
                    htmlFor="stage-change-comment"
                    className="block mb-2 text-sm font-semibold text-gray-700"
                  >
                    Izoh (majburiy)
                  </label>
                  <textarea
                    id="stage-change-comment"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm resize-none"
                    rows={4}
                    value={stageChangeComment}
                    onChange={(e) => setStageChangeComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end gap-4 p-5 bg-[var(--card-background)] rounded-b-2xl">
                  <button
                    type="button"
                    className="bg-[#475569] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#64748B] transition cursor-pointer"
                    onClick={() => setPatientToMove(null)}
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    className="px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm"
                    onClick={confirmStageChange}
                  >
                    Saqlash
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition show={!!patientToDelete} as={Fragment}>
        <Dialog onClose={() => setPatientToDelete(null)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
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
              <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <Dialog.Title className="font-bold text-xl text-gray-900">
                    Tasdiqlash
                  </Dialog.Title>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-base">
                    Rostdan ham <strong>{patientToDelete?.name}</strong> ismli bemorni
                    o&apos;chirmoqchimisiz? Bu amalni orqaga qaytarib bo&apos;lmaydi.
                  </p>
                </div>
                <div className="flex justify-end gap-4 p-5 bg-gray-50 rounded-b-2xl">
                  <button
                    type="button"
                    className="px-5 py-3 text-sm font-semibold bg-[var(--input-bg)] text-[var(--text-color)] border  border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
                    onClick={() => setPatientToDelete(null)}
                  >
                    Yo&apos;q
                  </button>
                  <button
                    type="button"
                    className="px-5 py-3 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-sm"
                    onClick={confirmDeletePatient}
                  >
                    Ha, o&apos;chirish
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* New Patient Modal */}
      <Transition show={isNewPatientModalOpen} as={Fragment}>
        <Dialog onClose={() => setIsNewPatientModalOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
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
              <Dialog.Panel className="bg-[var(--background-color)] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)]">
                  <Dialog.Title className="font-bold text-xl text-gray-900">
                    Konsultatsiya uchun Anketa
                  </Dialog.Title>
                </div>
                <div className="p-8">
                  <div className="relative mb-10">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-[var(--card-background)] -translate-y-1/2 rounded-full"></div>
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-300 rounded-full"
                      style={{ width: `${((wizardStep - 1) / 2) * 100}%` }}
                    ></div>
                    <div className="flex justify-between relative">
                      {[1, 2, 3].map((step, index) => (
                        <div key={step} className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-md ${wizardStep >= step ? "bg-blue-600 text-white" : "bg-[var(--input-bg)] text-gray-500"
                              } transition`}
                          >
                            {step}
                          </div>
                          <div className="text-sm mt-2 text-gray-600 font-medium">
                            {["Shaxsiy", "Tibbiy", "Hujjatlar"][index]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <form ref={newPatientFormRef} onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    {wizardStep === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Ism
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm "
                            placeholder="Ism va familiya"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Telefon
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm "
                            placeholder="+998 90 123 45 67"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Pasport
                          </label>
                          <input
                            type="text"
                            name="passport"
                            className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm "
                            placeholder="AA1234567"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Tug&apos;ilgan sana
                          </label>
                          <input
                            type="date"
                            name="dob"
                            className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm "
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Jins
                          </label>
                          <select
                            name="gender"
                            className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm  "
                          >
                            <option value="Erkak">Erkak</option>
                            <option value="Ayol">Ayol</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Pochta
                          </label>
                          <input
                            type="email"
                            name="email"
                            className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm "
                            placeholder="example@domain.com"
                          />
                        </div>
                      </div>
                    )}
                    {wizardStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Shikoyatlar
                          </label>
                          <textarea
                            name="complaints"
                            className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm  resize-none"
                            rows={4}
                            placeholder="Bemorning shikoyatlari..."
                          ></textarea>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Oldingi tashxis
                          </label>
                          <textarea
                            name="diagnosis"
                            className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm  resize-none"
                            rows={4}
                            placeholder="Avval qo'yilgan tashxislar..."
                          ></textarea>
                        </div>
                      </div>
                    )}
                    {wizardStep === 3 && (
                      <div className="space-y-6">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Hujjatlar
                          </label>
                          <input
                            type="file"
                            multiple
                            onChange={(e) =>
                              setNewPatientFiles(e.target.files ? Array.from(e.target.files) : [])
                            }
                            className="w-full mt-2 p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm "
                          />
                          {newPatientFiles.length > 0 && (
                            <ul className="mt-4 space-y-2">
                              {newPatientFiles.map((file, index) => (
                                <li
                                  key={index}
                                  className="flex items-center justify-between bg-gray-50 p-3 rounded-xl shadow-sm"
                                >
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                  <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 w-8 h-8 rounded-full hover:bg-red-100 transition flex items-center justify-center"
                                    onClick={() =>
                                      setNewPatientFiles((prev) => prev.filter((_, i) => i !== index))
                                    }
                                  >
                                    &times;
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </form>
                </div>
                <div className="flex bg-[var(--card-background)] justify-end gap-4 p-5  rounded-b-2xl">
                  {wizardStep > 1 && (
                    <button
                      type="button"
                      className="bg-[#475569] text-white font-bold py-2 px-5 rounded-lg hover:bg-[#64748B] transition cursor-pointer"
                      onClick={handleWizardBack}
                    >
                      Orqaga
                    </button>
                  )}
                  <button
                    type="button"
                    className="px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm"
                    onClick={handleWizardNext}
                  >
                    {wizardStep === 3 ? "Tasdiqlash va Yuborish" : "Keyingisi"}
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Tag Management Modal */}
      <Transition show={isTagModalOpen} as={Fragment}>
        <Dialog onClose={() => setIsTagModalOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
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
              <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <Dialog.Title className="font-bold text-xl text-gray-900">
                    Holatlarni Boshqarish
                  </Dialog.Title>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <h6 className="font-bold text-gray-800 text-lg mb-3">Mavjud Holatlar</h6>
                    <ul className="space-y-3">
                      {tags.map((tag) => (
                        <li
                          key={tag.id}
                          className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm"
                        >
                          <span
                            className={`text-sm font-semibold px-4 py-2 rounded-full ${getTagColorClasses(tag.color)}`}
                          >
                            {tag.text}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-700 w-8 h-8 rounded-full hover:bg-red-100 transition flex items-center justify-center text-xl"
                            onClick={() => handleDeleteTag(tag.id)}
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-bold text-gray-800 text-lg mb-3">Yangi Holat Qo&apos;shish</h6>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="flex-grow p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                        placeholder="Yangi holat nomi..."
                      />
                      <select
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm bg-white w-32"
                      >
                        <option value="success">Yashil</option>
                        <option value="warning">Sariq</option>
                        <option value="danger">Qizil</option>
                        <option value="primary">Ko&apos;k</option>
                        <option value="secondary">Kulrang</option>
                      </select>
                      <button
                        className="px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm"
                        onClick={handleAddNewTag}
                      >
                        Qo&apos;shish
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* Filters Offcanvas */}
      <Transition show={isFiltersOpen} as={Fragment}>
        <Dialog onClose={() => setIsFiltersOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <Dialog.Title className="text-2xl font-bold text-gray-900">Filtrlar</Dialog.Title>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 transition text-gray-600 hover:text-gray-900"
                  onClick={() => setIsFiltersOpen(false)}
                >
                  <i className="bi bi-x-lg text-xl"></i>
                </button>
              </div>
              <div className="p-8">
                <p className="text-gray-600 text-base">Bu yerda filtrlar bo&apos;ladi...</p>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}