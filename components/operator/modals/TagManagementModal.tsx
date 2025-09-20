// components/modals/TagManagementModal.tsx
"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Tag, ToastMessage } from "@/types";
import api from "@/utils/api";
import { showToast } from "@/utils/toast";

type TagManagementModalProps = {
    isOpen: boolean;
    onClose: () => void;
    tags: Tag[];
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
    setToasts: React.Dispatch<React.SetStateAction<ToastMessage[]>>;
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

export default function TagManagementModal({
    isOpen,
    onClose,
    tags,
    setTags,
    setToasts,
}: TagManagementModalProps) {
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("success");

    const handleAddNewTag = async () => {
        if (!newTagName.trim()) {
            showToast(setToasts, "Holat nomini kiriting!", "warning");
            return;
        }

        try {
            const { data: newTagData } = await api.post("tags/", {
                name: newTagName,
                color: newTagColor,
            });

            const newTag: Tag = {
                id: newTagData.id,
                text: newTagData.name,
                color: newTagData.color,
            };

            setTags((prev) => [...prev, newTag]);
            setNewTagName("");
            showToast(setToasts, "Yangi holat muvaffaqiyatli qo'shildi");
        } catch (error) {
            showToast(setToasts, "Yangi holat qo'shishda xatolik yuz berdi", "danger");
        }
    };

    const handleDeleteTag = async (tagId: number) => {
        try {
            await api.delete(`tags/${tagId}/`);
            setTags((prev) => prev.filter((t) => t.id !== tagId));
            showToast(setToasts, "Holat o'chirildi", "warning");
        } catch (error) {
            showToast(setToasts, "Holatni o'chirishda xatolik yuz berdi", "danger");
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        aria-hidden="true"
                    />
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
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <Dialog.Title className="font-bold text-xl text-gray-900">
                                    Holatlarni Boshqarish
                                </Dialog.Title>
                                <button
                                    type="button"
                                    className="p-2 rounded-full hover:bg-gray-100 transition text-gray-600 hover:text-gray-900"
                                    onClick={onClose}
                                >
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>
                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <h6 className="font-bold text-gray-800 text-base mb-3">
                                        Mavjud Holatlar
                                    </h6>
                                    <ul className="space-y-3">
                                        {tags.map((tag) => (
                                            <li
                                                key={tag.id}
                                                className="flex justify-between items-center bg-gray-50 p-3 rounded-xl shadow-sm"
                                            >
                                                <span
                                                    className={`text-sm font-semibold px-4 py-2 rounded-full ${getTagColorClasses(
                                                        tag.color
                                                    )}`}
                                                >
                                                    {tag.text}
                                                </span>
                                                <button
                                                    className="text-red-500 hover:text-red-700 w-8 h-8 rounded-full hover:bg-red-100 transition flex items-center justify-center text-xl font-bold"
                                                    onClick={() => handleDeleteTag(tag.id)}
                                                    title="O'chirish"
                                                >
                                                    &times;
                                                </button>
                                            </li>
                                        ))}
                                        {tags.length === 0 && (
                                            <p className="text-center text-gray-400 py-4">Mavjud holatlar yo'q.</p>
                                        )}
                                    </ul>
                                </div>
                                <div className="border-t border-gray-200 pt-6">
                                    <h6 className="font-bold text-gray-800 text-base mb-3">
                                        Yangi Holat Qo'shish
                                    </h6>
                                    <div className="flex flex-col sm:flex-row gap-3">
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
                                            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition shadow-sm bg-white sm:w-32"
                                        >
                                            <option value="success">Yashil</option>
                                            <option value="warning">Sariq</option>
                                            <option value="danger">Qizil</option>
                                            <option value="primary">Ko'k</option>
                                            <option value="secondary">Kulrang</option>
                                        </select>
                                    </div>
                                    <button
                                        className="w-full mt-4 px-5 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition shadow-sm"
                                        onClick={handleAddNewTag}
                                    >
                                        Qo'shish
                                    </button>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}