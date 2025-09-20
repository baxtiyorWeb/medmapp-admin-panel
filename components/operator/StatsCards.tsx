// components/StatsCards.tsx
import React from "react";
import { Patient } from "@/types";

type StatsCardsProps = {
    patients: Patient[];
};

export default function StatsCards({ patients }: StatsCardsProps) {
    const totalPatients = patients.length;
    const newPatients = patients.filter((p) => p.stageId === "stage1").length;
    const activePatients = patients.filter((p) => p.stageId !== "stage5").length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:gap-6 md:mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex items-center gap-4 hover:-translate-y-1 md:p-6">
                <div className="p-4 rounded-full bg-blue-50 text-blue-600 shadow-sm">
                    <i className="bi bi-people-fill text-3xl"></i>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Jami Bitimlar</p>
                    <h4 className="text-3xl font-bold text-gray-900">{totalPatients}</h4>
                </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex items-center gap-4 hover:-translate-y-1 md:p-6">
                <div className="p-4 rounded-full bg-green-50 text-green-600 shadow-sm">
                    <i className="bi bi-person-plus-fill text-3xl"></i>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Yangi Bemorlar</p>
                    <h4 className="text-3xl font-bold text-gray-900">{newPatients}</h4>
                </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex items-center gap-4 hover:-translate-y-1 md:p-6">
                <div className="p-4 rounded-full bg-yellow-50 text-yellow-600 shadow-sm">
                    <i className="bi bi-check-circle-fill text-3xl"></i>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Faol Bemorlar</p>
                    <h4 className="text-3xl font-bold text-gray-900">{activePatients}</h4>
                </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex items-center gap-4 hover:-translate-y-1 md:p-6">
                <div className="p-4 rounded-full bg-indigo-50 text-indigo-600 shadow-sm">
                    <i className="bi bi-cash-stack text-3xl"></i>
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Kutilayotgan Daromad</p>
                    <h4 className="text-3xl font-bold text-gray-900">$2,564</h4>
                </div>
            </div>
        </div>
    );
}