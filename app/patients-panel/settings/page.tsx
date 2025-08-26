"use client";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize dark mode from localStorage
    const isDark = localStorage.getItem("medmapp_dark") === "true";
    setIsDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    // Handle clicks outside dropdowns
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(e.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      document.body.classList.toggle("sidebar-collapsed");
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("medmapp_dark", (!isDarkMode).toString());
  };

  return (
    <>
      <div className="flex h-auto overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden ">
          <main className="flex-1  ">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white rounded-2xl shadow-lg">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-bold text-slate-800">
                    Profil Sozlamalari
                  </h2>
                  <p className="text-sm text-slate-500">
                    Shaxsiy ma&apos;lumotlaringizni yangilang.
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-6">
                    <img
                      className="h-20 w-20 rounded-full object-cover"
                      src="https://placehold.co/80x80/EFEFEF/333333?text=A"
                      alt="Profil rasmi"
                    />
                    <div>
                      <button className="bg-[#4153F1] text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition">
                        Rasm yuklash
                      </button>
                      <button className="text-sm text-slate-500 hover:text-danger ml-3">
                        O&apos;chirish
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="text-sm font-medium text-slate-700 mb-1 block"
                      >
                        To&apos;liq ism
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        defaultValue="Ali Valiyev"
                        className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-slate-700 mb-1 block"
                      >
                        Elektron pochta
                      </label>
                      <input
                        type="email"
                        id="email"
                        defaultValue="ali.valiyev@example.com"
                        className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium text-slate-700 mb-1 block"
                      >
                        Telefon raqam (kirish uchun)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        defaultValue="+998 90 123 45 67"
                        className="w-full p-3 bg-slate-200 border border-slate-300 rounded-lg cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="region"
                        className="text-sm font-medium text-slate-700 mb-1 block"
                      >
                        Viloyat
                      </label>
                      <select
                        id="region"
                        className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                      >
                        <option>Toshkent shahri</option>
                        <option>Toshkent viloyati</option>
                        <option>Andijon viloyati</option>
                        <option>Buxoro viloyati</option>
                        <option>Farg&apos;ona viloyati</option>
                        <option>Jizzax viloyati</option>
                        <option>Xorazm viloyati</option>
                        <option>Namangan viloyati</option>
                        <option>Navoiy viloyati</option>
                        <option>Qashqadaryo viloyati</option>
                        <option>Samarqand viloyati</option>
                        <option>Sirdaryo viloyati</option>
                        <option>Surxondaryo viloyati</option>
                        <option>Qoraqalpog&apos;iston Respublikasi</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-b-2xl text-right">
                  <button className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-600 transition">
                    O&apos;zgarishlarni saqlash
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-[#EF4444]/20">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg  font-bold text-[#EF4444]">
                    Xavfli Hudud
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div className="mb-3 sm:mb-0">
                      <h4 className="font-semibold text-slate-700">
                        Hisobni o&apos;chirish
                      </h4>
                      <p className="text-sm text-slate-500">
                        Hisobingiz o&apos;chirilgach, uni qayta tiklab
                        bo&apos;lmaydi.
                      </p>
                    </div>
                    <button className="bg-[#EF4444]/10 text-[#EF4444] text-sm font-bold py-2 px-4 rounded-lg hover:bg-danger/20 transition self-start sm:self-center">
                      Hisobni o&apos;chirish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Settings;
