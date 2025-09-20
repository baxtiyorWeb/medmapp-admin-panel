// components/modals/NewPatientModal.tsx
"use client";
import React, { Fragment, useState, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Patient, ToastMessage } from "@/types";
import { showToast } from "@/utils/toast";

type NewPatientModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        patientData: Omit<Patient, "id" | "history" | "lastUpdatedAt">,
        files: File[]
    ) => Promise<void>;
    setToasts: React.Dispatch<React.SetStateAction<ToastMessage[]>>;
};

export default function NewPatientModal({
    isOpen,
    onClose,
    onSubmit,
    setToasts,
}: NewPatientModalProps) {
    const [wizardStep, setWizardStep] = useState(1);
    const [newPatientFiles, setNewPatientFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Controlled form state
    const [formValues, setFormValues] = useState({
        name: "",
        phone: "",
        passport: "",
        dob: "",
        gender: "Erkak",
        email: "",
        complaints: "",
        diagnosis: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setWizardStep(1);
        setNewPatientFiles([]);
        setFormValues({
            name: "",
            phone: "",
            passport: "",
            dob: "",
            gender: "Erkak",
            email: "",
            complaints: "",
            diagnosis: "",
        });
        onClose();
    };

    const handleWizardNext = async () => {
        if (wizardStep < 3) {
            if (wizardStep === 1) {
                if (!formValues.name.trim() || !formValues.phone.trim()) {
                    showToast(setToasts, "Ism va Telefon maydonlari majburiy!", "danger");
                    return;
                }
            }
            setWizardStep(wizardStep + 1);
            return;
        }

        // Final step
        setIsSubmitting(true);
        if (!formValues.name.trim() || !formValues.phone.trim()) {
            showToast(setToasts, "Ism va Telefon maydonlari majburiy!", "danger");
            setWizardStep(1);
            setIsSubmitting(false);
            return;
        }

        const newPatientData: Omit<Patient, "id" | "history" | "lastUpdatedAt"> = {
            name: formValues.name,
            stageId: "stage1",
            source: "Anketa",
            createdBy: "Operator",
            details: {
                phone: formValues.phone,
                email: formValues.email,
                passport: formValues.passport,
                dob: formValues.dob,
                gender: formValues.gender,
                complaints: formValues.complaints,
                previousDiagnosis: formValues.diagnosis,
                documents: [],
            },
        };

        try {
            await onSubmit(newPatientData, newPatientFiles);
            handleClose();
        } catch (error) {
            console.error("Xatolik:", error);
            showToast(setToasts, "Bemor qo'shishda xatolik yuz berdi", "danger");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWizardBack = () => {
        if (wizardStep > 1) setWizardStep(wizardStep - 1);
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={handleClose} className="relative z-50">
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
                        <Dialog.Panel className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <Dialog.Title className="font-bold text-xl text-gray-900">
                                    Konsultatsiya uchun Anketa
                                </Dialog.Title>
                            </div>
                            <div className="p-8">
                                {/* Progress */}
                                <div className="relative mb-10">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
                                    <div
                                        className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-300 rounded-full"
                                        style={{ width: `${((wizardStep - 1) / 2) * 100}%` }}
                                    ></div>
                                    <div className="flex justify-between relative">
                                        {[1, 2, 3].map((step, index) => (
                                            <div key={step} className="flex flex-col items-center">
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-md transition ${wizardStep >= step
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-200 text-gray-500"
                                                        }`}
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
                                {/* Form */}
                                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                                    {wizardStep === 1 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ism</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formValues.name}
                                                    onChange={handleInputChange}
                                                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                                    placeholder="Ism va familiya"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Telefon</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formValues.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                                    placeholder="+998 90 123 45 67"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pasport</label>
                                                <input
                                                    type="text"
                                                    name="passport"
                                                    value={formValues.passport}
                                                    onChange={handleInputChange}
                                                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                                    placeholder="AA1234567"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tug'ilgan sana</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={formValues.dob}
                                                    onChange={handleInputChange}
                                                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Jins</label>
                                                <select
                                                    name="gender"
                                                    value={formValues.gender}
                                                    onChange={handleInputChange}
                                                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm bg-white"
                                                >
                                                    <option value="Erkak">Erkak</option>
                                                    <option value="Ayol">Ayol</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pochta</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formValues.email}
                                                    onChange={handleInputChange}
                                                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                                    placeholder="example@domain.com"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {wizardStep === 2 && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Shikoyatlar</label>
                                                <textarea
                                                    name="complaints"
                                                    value={formValues.complaints}
                                                    onChange={handleInputChange}
                                                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm resize-none"
                                                    rows={4}
                                                    placeholder="Bemorning shikoyatlari..."
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Oldingi tashxis</label>
                                                <textarea
                                                    name="diagnosis"
                                                    value={formValues.diagnosis}
                                                    onChange={handleInputChange}
                                                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm resize-none"
                                                    rows={4}
                                                    placeholder="Avval qo'yilgan tashxislar..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    )}
                                    {wizardStep === 3 && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div>
                                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hujjatlar</label>
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={(e) =>
                                                        setNewPatientFiles(e.target.files ? Array.from(e.target.files) : [])
                                                    }
                                                    className="w-full mt-2 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                                                                    className="text-red-500 hover:text-red-700 w-8 h-8 rounded-full hover:bg-red-100 transition flex items-center justify-center font-bold"
                                                                    onClick={() =>
                                                                        setNewPatientFiles((prev) =>
                                                                            prev.filter((_, i) => i !== index)
                                                                        )
                                                                    }
                                                                >
                                                                    ×
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
                            <div className="flex justify-between sm:justify-end gap-4 p-5 bg-gray-50 rounded-b-2xl">
                                {wizardStep > 1 && (
                                    <button
                                        type="button"
                                        className="px-5 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm"
                                        onClick={handleWizardBack}
                                    >
                                        Orqaga
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed"
                                    onClick={handleWizardNext}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Yuborilmoqda..."
                                        : wizardStep === 3
                                            ? "Tasdiqlash va Yuborish"
                                            : "Keyingisi"}
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}