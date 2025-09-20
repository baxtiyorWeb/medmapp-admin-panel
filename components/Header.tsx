"use client";
import Image from "next/image";
import { useState } from "react";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    typeof window !== "undefined" &&
      localStorage.getItem("medmapp_dark") === "true"
  );


  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("medmapp_dark", newDarkMode.toString());
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <header className="flex items-center justify-between py-4 px-8 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-[89px] flex-shrink-0">
      <div className="flex items-center">
        <button
          id="sidebar-toggle"
          className="-ml-2 mr-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <i className="bi bi-list text-3xl"></i>
        </button>
        <h1 className="hidden md:block text-2xl font-semibold text-slate-800 dark:text-white">
          Boshqaruv Paneli
        </h1>
      </div>
      <div className="flex items-center space-x-3 md:space-x-5">
        <button
          onClick={toggleDarkMode}
          className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary-300"
        >
          <i
            className={`bi ${
              isDarkMode ? "bi-sun-fill" : "bi-moon-stars-fill"
            } text-xl`}
          ></i>
        </button>
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="profile-toggle flex items-center space-x-3"
          >
            <Image
              className="h-10 w-10 rounded-full object-cover"
              src="https://placehold.co/40x40/EFEFEF/333333?text=A"
              alt="Profil rasmi"
            />
            <div className="hidden md:block text-left">
              <div className="font-bold text-slate-700 dark:text-slate-200">
                Ali Valiyev
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Bemor
              </div>
            </div>
          </button>
          <div
            className={`profile-dropdown absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-10 ${
              isProfileOpen ? "block" : "hidden"
            }`}
          >
            <a
              href="#"
              className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-600"
            >
              <i className="bi bi-box-arrow-right mr-2"></i>Chiqish
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
