// components/PatientDetailsOffcanvas.tsx
import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Patient, Tag, Stage, PatientDetails } from "@/types";

type PatientDetailsOffcanvasProps = {
    patient: Patient;
    tags: Tag[];
    stages: Stage[];
    onClose: () => void;
    onDelete: (patient: Patient) => void;
    onSave: (updatedDetails: PatientDetails) => Promise<void>;
};

export default function PatientDetailsOffcanvas({
    patient,
    tags,
    stages,
    onClose,
    onDelete,
    onSave,
}: PatientDetailsOffcanvasProps) {
    const [editingSection, setEditingSection] = useState<"personal" | "medical" | null>(null);
    const [editingDetails, setEditingDetails] = useState<PatientDetails | null>(null);

    useEffect(() => {
        if (patient) {
            setEditingDetails(JSON.parse(JSON.stringify(patient.details)));
        }
    }, [patient]);

    const handleStartEditing = (section: "personal" | "medical") => {
        setEditingSection(section);
        setEditingDetails(JSON.parse(JSON.stringify(patient.details)));
    };

    const handleCancelEditing = () => {
        setEditingSection(null);
        setEditingDetails(patient.details);
    };

    const handleSave = async () => {
        if (editingDetails) {
            await onSave(editingDetails);
            setEditingSection(null);
        }
    }

    const handleDetailChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        if (!editingDetails) return;
        setEditingDetails((prev) =>
            prev ? { ...prev, [e.target.name]: e.target.value } : null
        );
    };


    return (
        <Transition show={!!patient} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                </Transition.Child>
                <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-200" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                    <Dialog.Panel className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <Dialog.Title className="text-2xl font-bold text-gray-900">{patient.name}</Dialog.Title>
                            <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition text-gray-600 hover:text-gray-900" onClick={onClose}>
                                <i className="bi bi-x-lg text-xl"></i>
                            </button>
                        </div>
                        <div className="p-8 overflow-y-auto h-[calc(100vh-80px)] bg-gray-50 space-y-6">
                            {/* Personal Details */}
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                {/* ... JSX for personal details, editing and view mode */}
                            </div>
                            {/* Medical Details */}
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                {/* ... JSX for medical details, editing and view mode */}
                            </div>

                            {/* Delete button */}
                            <div className="mt-8">
                                <button onClick={() => onDelete(patient)} className="w-full py-3 text-red-600 bg-white border border-red-200 rounded-2xl hover:bg-red-50 hover:border-red-300 transition shadow-sm hover:shadow-md font-semibold">
                                    <i className="bi bi-trash mr-2"></i>Bemorni o'chirish
                                </button>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}