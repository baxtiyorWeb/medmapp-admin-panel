// components/Header.tsx
import React from "react";

type HeaderProps = {
    onNewPatientClick: () => void;
    onTagManagerClick: () => void;
    setSearchTerm: (term: string) => void;
};

export default function Header({ onNewPatientClick, onTagManagerClick, setSearchTerm }: HeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:mb-8 md:gap-6">
            <div className="w-full md:w-auto">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight md:text-4xl">
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
                        className="pl-12 pr-5 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow shadow-sm hover:shadow-md w-full md:w-64"
                        placeholder="Bemor qidirish..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className="px-5 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-200 flex items-center gap-2"
                    type="button"
                    onClick={onTagManagerClick}
                >
                    <i className="bi bi-tags text-lg"></i>
                    <span className="hidden md:inline">Holatlar</span>
                </button>
                <button
                    className="px-5 py-3 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-2xl shadow-md hover:shadow-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
                    onClick={onNewPatientClick}
                >
                    <i className="bi bi-plus-lg text-lg"></i>
                    <span className="hidden md:inline">Yangi Bemor</span>
                </button>
            </div>
        </div>
    );
}