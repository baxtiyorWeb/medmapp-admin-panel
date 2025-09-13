"use client";

import React, { useState, useEffect, useRef, Fragment } from "react";
import {
  initialPatients,
  initialStages,
  initialTags,
  Patient,
  Stage,
  Tag,
} from "../../lib/data";
import Sortable from "sortablejs";
import { Dialog, Transition } from "@headlessui/react";

type ToastMessage = {
  id: number;
  message: string;
  type: "success" | "danger" | "warning";
};

export default function OperatorPageClient() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [stages] = useState<Stage[]>(initialStages);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingSection, setEditingSection] = useState<
    "personal" | "medical" | null
  >(null);
  const [editingPatientDetails, setEditingPatientDetails] = useState<
    Patient["details"] | null
  >(null);

  type PatientToMove = { patientId: number; newStageId: string } | null;
  const [patientToMove, setPatientToMove] = useState<PatientToMove>(null);
  const [stageChangeComment, setStageChangeComment] = useState("");
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  // Modal and Offcanvas visibility states
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

  const showToast = (
    message: string,
    type: "success" | "danger" | "warning" = "success"
  ) => {
    const newToast: ToastMessage = { id: Date.now(), message, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => toast.id !== newToast.id)
      );
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
      stage1: "Hujjatlarni so'rash",
      stage2: "Klinika tanlash",
      stage3: "To'lovni qabul qilish",
      stage4: "Safar sanasini belgilash",
      stage5: "Yopilgan",
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

  useEffect(() => {
    setFilteredPatients(
      patients.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, patients]);

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
            const originalItem = evt.item;
            const originalList = evt.from;
            const originalIndex = evt.oldDraggableIndex;

            originalList.insertBefore(
              originalItem,
              originalList.children[originalIndex!]
            );

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
    const form = newPatientFormRef.current;
    if (!form) return;

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
    setIsNewPatientModalOpen(false);
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

  const getTagColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      danger: "bg-red-100 text-red-800",
      primary: "bg-sky-100 text-sky-800",
      secondary: "bg-slate-100 text-slate-800",
    };
    return colorMap[color] || colorMap.secondary;
  };

  const getToastColorClasses = (type: string) => {
    const colorMap: { [key: string]: string } = {
      success: "bg-green-500 text-white",
      danger: "bg-red-500 text-white",
      warning: "bg-yellow-500 text-black",
    };
    return colorMap[type];
  };

  return (
    <>
      <style jsx global>{`
        .sortable-ghost {
          background: #f0f9ff;
          border: 2px dashed #0ea5e9;
          opacity: 0.7;
        }
      `}</style>

      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-[100] space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between w-full max-w-xs p-4 rounded-lg shadow-lg ${getToastColorClasses(
              toast.type
            )}`}
          >
            <div className="text-sm font-normal">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="-mx-1.5 -my-1.5 ml-3 flex-shrink-0 h-8 w-8 rounded-lg p-1.5 inline-flex items-center justify-center hover:bg-white/20 focus:outline-none cursor-pointer"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        ))}
      </div>

      <section className="p-6 bg-slate-50 min-h-screen">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-3xl font-bold text-slate-800">
              Boshqaruv Paneli
            </h1>
          </div>
          <div className="w-full sm:w-auto flex flex-wrap items-center justify-start sm:justify-end gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="bi bi-search text-slate-400"></i>
              </span>
              <input
                type="search"
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                placeholder="Bemor qidirish..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-100 transition duration-150 cursor-pointer"
              type="button"
              onClick={() => setIsFiltersOpen(true)}
            >
              <i className="bi bi-funnel"></i>
              <span className="hidden sm:inline ml-2">Filtr</span>
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-100 transition duration-150 cursor-pointer"
              type="button"
              onClick={() => setIsTagModalOpen(true)}
            >
              <i className="bi bi-tags"></i>
              <span className="hidden sm:inline ml-2">Holatlar</span>
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-lg shadow-sm hover:bg-sky-700 transition duration-150 cursor-pointer"
              onClick={handleOpenNewPatientModal}
            >
              <i className="bi bi-plus-lg"></i>
              <span className="hidden sm:inline ml-2">Yangi Bemor</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-5 transition hover:shadow-lg hover:-translate-y-1">
            <div className="p-4 rounded-full bg-sky-100 text-sky-600">
              <i className="bi bi-people-fill text-2xl"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500">Jami Bitimlar</p>
              <h4 className="text-2xl font-bold text-slate-800">
                {patients.length}
              </h4>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-5 transition hover:shadow-lg hover:-translate-y-1">
            <div className="p-4 rounded-full bg-green-100 text-green-600">
              <i className="bi bi-person-plus-fill text-2xl"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500">Yangi Bemorlar</p>
              <h4 className="text-2xl font-bold text-slate-800">
                {patients.filter((p) => p.stageId === "stage1").length}
              </h4>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-5 transition hover:shadow-lg hover:-translate-y-1">
            <div className="p-4 rounded-full bg-yellow-100 text-yellow-600">
              <i className="bi bi-check-circle-fill text-2xl"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500">Faol Bemorlar</p>
              <h4 className="text-2xl font-bold text-slate-800">
                {patients.filter((p) => p.stageId !== "stage5").length}
              </h4>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-5 transition hover:shadow-lg hover:-translate-y-1">
            <div className="p-4 rounded-full bg-indigo-100 text-indigo-600">
              <i className="bi bi-cash-stack text-2xl"></i>
            </div>
            <div>
              <p className="text-sm text-slate-500">Kutilayotgan Daromad</p>
              <h4 className="text-2xl font-bold text-slate-800">$2,564</h4>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto pb-4">
          <div
            className="grid grid-flow-col auto-cols-[320px] gap-4 min-w-max"
            ref={kanbanBoardRef}
          >
            {stages.map((stage) => {
              const patientsInStage = filteredPatients.filter(
                (p) => p.stageId === stage.id
              );
              return (
                <div
                  key={stage.id}
                  className="flex flex-col bg-slate-100 rounded-xl"
                >
                  <div
                    className={`p-4 font-bold text-slate-700 border-b-4 ${stage.colorClass}`}
                  >
                    <span>
                      {stage.title} ({patientsInStage.length})
                    </span>
                  </div>
                  <div
                    className="kanban-cards flex-grow p-2 space-y-3 overflow-y-auto"
                    data-stage-id={stage.id}
                  >
                    {patientsInStage.length > 0 ? (
                      patientsInStage.map((patient) => {
                        const tag = tags.find(
                          (t) => t.id === patient.tagId
                        ) || {
                          color: "secondary",
                          text: "Noma'lum",
                        };
                        const lastHistory =
                          patient.history[patient.history.length - 1];
                        return (
                          <div
                            key={patient.id}
                            className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                            data-id={patient.id}
                            onClick={() => setSelectedPatient(patient)}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="font-semibold text-slate-800">
                                  {patient.name}
                                </div>
                                <div className="text-slate-500 text-sm">
                                  {patient.details.phone}
                                </div>
                              </div>
                              <span
                                className={`text-xs font-medium px-2.5 py-1 rounded-full ${getTagColorClasses(
                                  tag.color
                                )}`}
                              >
                                {tag.text}
                              </span>
                            </div>
                            <div className="space-y-2.5 text-sm text-slate-600 mb-4">
                              <div className="flex items-start gap-2.5">
                                <i className="bi bi-info-circle-fill text-slate-400 mt-1"></i>
                                <span>{lastHistory?.text}</span>
                              </div>
                              <div className="flex items-start gap-2.5">
                                <i className="bi bi-exclamation-diamond-fill text-slate-400 mt-1"></i>
                                <span>
                                  Keyingi qadam:{" "}
                                  {getNextStepText(patient.stageId)}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-500">
                              <span>
                                <i className="bi bi-bookmark-star-fill mr-1"></i>
                                {patient.source}
                              </span>
                              <span>{formatDate(lastHistory?.date)}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-slate-400 p-5">
                        <i className="bi bi-moon-stars text-4xl"></i>
                        <p className="mt-2 text-sm">Bemorlar yo'q</p>
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
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
            <Dialog.Panel className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl">
              {selectedPatient && (
                <>
                  <div className="flex justify-between items-center p-4 border-b">
                    <Dialog.Title className="text-xl font-semibold text-slate-800">
                      {selectedPatient.name}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="p-1 rounded-full hover:bg-slate-200 cursor-pointer"
                      onClick={handleClosePatientDetails}
                    >
                      <i className="bi bi-x-lg text-xl"></i>
                    </button>
                  </div>
                  <div className="p-5 overflow-y-auto h-[calc(100vh-69px)] bg-slate-50 space-y-5">
                    {/* Personal Details Card */}
                    <div className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h6 className="font-semibold text-slate-700">
                          <i className="bi bi-person-badge mr-2"></i>Shaxsiy
                          ma'lumotlar
                        </h6>
                        {editingSection !== "personal" ? (
                          <button
                            className="text-sky-600 hover:text-sky-800 text-sm font-medium cursor-pointer"
                            onClick={() => handleStartEditing("personal")}
                          >
                            <i className="bi bi-pencil"></i> Tahrirlash
                          </button>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 cursor-pointer"
                              onClick={handleSaveDetails}
                            >
                              <i className="bi bi-check-lg"></i> Saqlash
                            </button>
                            <button
                              className="px-3 py-1 text-sm bg-slate-200 rounded hover:bg-slate-300 cursor-pointer"
                              onClick={handleCancelEditing}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        {editingSection === "personal" &&
                        editingPatientDetails ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-slate-500">
                                Pasport
                              </label>
                              <input
                                type="text"
                                name="passport"
                                value={editingPatientDetails.passport}
                                onChange={handleDetailChange}
                                className="w-full mt-1 p-2 border rounded-md"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-slate-500">
                                Tug'ilgan sana
                              </label>
                              <input
                                type="date"
                                name="dob"
                                value={editingPatientDetails.dob}
                                onChange={handleDetailChange}
                                className="w-full mt-1 p-2 border rounded-md"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-slate-500">
                                Jins
                              </label>
                              <select
                                name="gender"
                                value={editingPatientDetails.gender}
                                onChange={handleDetailChange}
                                className="w-full mt-1 p-2 border rounded-md bg-white"
                              >
                                <option value="Erkak">Erkak</option>
                                <option value="Ayol">Ayol</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-slate-500">
                                Telefon
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={editingPatientDetails.phone}
                                onChange={handleDetailChange}
                                className="w-full mt-1 p-2 border rounded-md"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="text-xs text-slate-500">
                                Pochta
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={editingPatientDetails.email}
                                onChange={handleDetailChange}
                                className="w-full mt-1 p-2 border rounded-md"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between py-1.5">
                              <span className="text-slate-500">Pasport</span>
                              <span className="font-medium text-slate-800">
                                {selectedPatient.details.passport}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="text-slate-500">
                                Tug'ilgan sana
                              </span>
                              <span className="font-medium text-slate-800">
                                {selectedPatient.details.dob}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="text-slate-500">Jins</span>
                              <span className="font-medium text-slate-800">
                                {selectedPatient.details.gender}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="text-slate-500">Telefon</span>
                              <span className="font-medium text-slate-800">
                                {selectedPatient.details.phone}
                              </span>
                            </div>
                            <div className="flex justify-between py-1.5">
                              <span className="text-slate-500">Pochta</span>
                              <span className="font-medium text-slate-800">
                                {selectedPatient.details.email}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Medical Details Card */}
                    {/* ... */}
                    <div className="mt-6">
                      <button
                        className="w-full py-2.5 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 cursor-pointer transition"
                        onClick={() => setPatientToDelete(selectedPatient)}
                      >
                        <i className="bi bi-trash mr-2"></i>Bemorni o'chirish
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
        <Dialog
          onClose={() => setPatientToMove(null)}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
              <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-5 border-b">
                  <Dialog.Title className="font-semibold text-lg text-slate-800">
                    Bosqichni O'zgartirish
                  </Dialog.Title>
                </div>
                <div className="p-5">
                  <p className="mb-4 text-slate-600">
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
                  <label
                    htmlFor="stage-change-comment"
                    className="block mb-1 text-sm font-medium text-slate-700"
                  >
                    Izoh (majburiy)
                  </label>
                  <textarea
                    id="stage-change-comment"
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 transition"
                    rows={3}
                    value={stageChangeComment}
                    onChange={(e) => setStageChangeComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 p-4 bg-slate-50 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer transition"
                    onClick={() => setPatientToMove(null)}
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 cursor-pointer transition"
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
        <Dialog
          onClose={() => setPatientToDelete(null)}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
              <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-5 border-b">
                  <Dialog.Title className="font-semibold text-lg text-slate-800">
                    Tasdiqlash
                  </Dialog.Title>
                </div>
                <div className="p-5">
                  <p className="text-slate-600">
                    Rostdan ham <strong>{patientToDelete?.name}</strong> ismli
                    bemorni o'chirmoqchimisiz? Bu amalni orqaga qaytarib
                    bo'lmaydi.
                  </p>
                </div>
                <div className="flex justify-end gap-3 p-4 bg-slate-50 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 cursor-pointer transition"
                    onClick={() => setPatientToDelete(null)}
                  >
                    Yo'q
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 cursor-pointer transition"
                    onClick={confirmDeletePatient}
                  >
                    Ha, o'chirish
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* New Patient Modal */}
      <Transition show={isNewPatientModalOpen} as={Fragment}>
        <Dialog
          onClose={() => setIsNewPatientModalOpen(false)}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
              <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
                <div className="p-5 border-b">
                  <Dialog.Title className="font-semibold text-lg text-slate-800">
                    Konsultatsiya uchun Anketa
                  </Dialog.Title>
                </div>
                <div className="p-6">
                  <div className="relative mb-8">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2"></div>
                    <div
                      className="absolute top-1/2 left-0 h-0.5 bg-sky-600 -translate-y-1/2 transition-all duration-300"
                      style={{ width: `${((wizardStep - 1) / 2) * 100}%` }}
                    ></div>
                    <div className="flex justify-between relative">
                      {[1, 2, 3].map((step, index) => (
                        <div key={step} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              wizardStep >= step
                                ? "bg-sky-600 text-white"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {step}
                          </div>
                          <div className="text-xs mt-1 text-slate-500">
                            {["Shaxsiy", "Tibbiy", "Hujjatlar"][index]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <form
                    ref={newPatientFormRef}
                    onSubmit={(e) => e.preventDefault()}
                  >
                    {/* Form steps content */}
                  </form>
                </div>
                <div className="flex justify-end gap-3 p-4 bg-slate-50 rounded-b-lg">
                  {wizardStep > 1 && (
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium bg-white border rounded-md cursor-pointer"
                      onClick={handleWizardBack}
                    >
                      Orqaga
                    </button>
                  )}
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md cursor-pointer"
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
        <Dialog
          onClose={() => setIsTagModalOpen(false)}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
              <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-5 border-b">
                  <Dialog.Title className="font-semibold text-lg text-slate-800">
                    Holatlarni Boshqarish
                  </Dialog.Title>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <h6 className="font-medium text-slate-600 mb-2">
                      Mavjud Holatlar
                    </h6>
                    <ul className="space-y-2">
                      {tags.map((tag) => (
                        <li
                          key={tag.id}
                          className="flex justify-between items-center bg-slate-50 p-2 rounded-md"
                        >
                          <span
                            className={`text-sm font-medium px-2.5 py-1 rounded-full ${getTagColorClasses(
                              tag.color
                            )}`}
                          >
                            {tag.text}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-700 w-6 h-6 rounded-full hover:bg-red-100 cursor-pointer"
                            onClick={() => handleDeleteTag(tag.id)}
                          >
                            &times;
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-slate-600 mb-2">
                      Yangi Holat Qo'shish
                    </h6>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        className="flex-grow p-2 border border-slate-300 rounded-md"
                        placeholder="Yangi holat nomi..."
                      />
                      <select
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        className="p-2 border border-slate-300 rounded-md bg-white"
                      >
                        <option value="success">Yashil</option>
                        <option value="warning">Sariq</option>
                        <option value="danger">Qizil</option>
                        <option value="primary">Ko'k</option>
                        <option value="secondary">Kulrang</option>
                      </select>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 cursor-pointer"
                        onClick={handleAddNewTag}
                      >
                        Qo'shish
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
        <Dialog
          onClose={() => setIsFiltersOpen(false)}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
            <Dialog.Panel className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl">
              <div className="flex justify-between items-center p-4 border-b">
                <Dialog.Title className="text-xl font-semibold text-slate-800">
                  Filtrlar
                </Dialog.Title>
                <button
                  type="button"
                  className="p-1 rounded-full hover:bg-slate-200 cursor-pointer"
                  onClick={() => setIsFiltersOpen(false)}
                >
                  <i className="bi bi-x-lg text-xl"></i>
                </button>
              </div>
              <div className="p-5">
                <p>Bu yerda filtrlar bo'ladi...</p>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
