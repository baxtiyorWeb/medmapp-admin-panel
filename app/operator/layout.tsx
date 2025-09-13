"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Stethoscope,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { get, isArray } from "lodash";
import useProfile from "@/hooks/useProfile";
import "./layout.css";
import { SidebarItem } from "@/components/SidebarItem";
import { useDarkModeContext } from "@/providers/DarkThemeProvider";

export default function OperatorLayout({ children }: React.PropsWithChildren) {
  const [isSidebarCollapsed] = useState(false);
  const [isSidebarToggled, setSidebarToggled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode } = useDarkModeContext();

  const { fetchProfile } = useProfile();
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => await fetchProfile(),
    staleTime: 5 * 60 * 1000,
  });

  const isData = isArray(data) ? data : [data];
  const dataItem = isData && isData.length > 0 ? isData[0] : null;

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth < 768;
      setIsMobile(mobileView);
      setIsSidebarOpen(!mobileView);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const profileToggle = document.querySelector(".profile-toggle");
      const profileDropdown = document.querySelector(".profile-dropdown");
      if (
        isProfileDropdownOpen &&
        profileToggle &&
        profileDropdown &&
        !profileToggle.contains(event.target as Node) &&
        !profileDropdown.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isProfileDropdownOpen]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark")
      document.documentElement.classList.add("dark-mode");
  }, []);

  // const handleToggleSidebar = () => {
  //   if (window.innerWidth < 1200) setSidebarToggled(!isSidebarToggled);
  //   else setSidebarCollapsed(!isSidebarCollapsed);
  // };

  return (
    <div
      className={`wrapper ${isSidebarCollapsed ? "sidebar-collapsed" : ""} ${
        isSidebarToggled ? "sidebar-toggled" : ""
      }`}
    >
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-[var(--card-background)]  flex flex-col border-r border-[var(--border-color)] transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center p-6 mb-2 h-[89px] flex-shrink-0">
          <Link href="/">
            <Image
              className="h-[66px] w-auto"
              width={150}
              height={66}
              src="https://medmapp.netlify.app/images/MedMapp_Logo_shaffof.png"
              alt="MedMapp Logo"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/150x40/ffffff/0f172a?text=MedMapp";
              }}
            />
          </Link>
        </div>
        <nav className="flex-grow pb-6 space-y-[5px]">
          <SidebarItem
            link="/patients-panel"
            icon={BsFillGrid1X2Fill}
            text="Boshqaruv Paneli"
            open={isSidebarOpen}
            active={pathname === "/patients-panel"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/patients-panel/applications"
            icon={Calendar}
            text="Yangi Murojaatlar"
            open={isSidebarOpen}
            active={pathname === "/patients-panel/applications"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/patients-panel/consultations"
            icon={MessageSquare}
            text="Bajarilgan Murojaatlar"
            open={isSidebarOpen}
            active={pathname === "/patients-panel/consultations"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/patients-panel/reviews"
            icon={Stethoscope}
            text="Klinikalar Bazasi"
            open={isSidebarOpen}
            active={pathname === "/patients-panel/reviews"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/patients-panel/settings"
            icon={Settings}
            text="Moliya"
            open={isSidebarOpen}
            active={pathname === "/patients-panel/settings"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/login"
            icon={LogOut}
            text="Chiqish"
            open={isSidebarOpen}
            className="text-[var(--color-danger)]  cursor-pointer absolute bottom-10"
            active={pathname === "/login"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
        </nav>
      </aside>
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-0 md:ml-[260px]" : "ml-0"
        }`}
      >
        <header className="flex items-center justify-between py-4 px-8 bg-[var(--card-background)] border-b border-[var(--border-color)] h-[89px] flex-shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              id="sidebar-toggle"
              className="text-[var(--text-light)] hover:text-[var(--text-color)] -ml-2 mr-4"
            >
              <i className="bi bi-list text-3xl"></i>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button className="lang-toggle cursor-pointer text-[var(--text-light)] hover:text-[var(--color-primary)]">
                <i className="bi bi-translate text-xl"></i>
              </button>
            </div>
            <div>
              <button
                id="dark-mode-toggle"
                className="text-[var(--text-light)] cursor-pointer hover:text-[var(--color-primary)]"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <i className="bi bi-sun-fill text-xl"></i>
                ) : (
                  <i className="bi bi-moon-stars-fill text-xl"></i>
                )}
              </button>
            </div>
            <div>
              <button className="text-[var(--text-light)] cursor-pointer hover:text-[var(--color-primary)]">
                <i className="bi bi-bell text-xl"></i>
              </button>
            </div>
            <div className="relative">
              <button
                className="profile-toggle cursor-pointer flex items-center space-x-3"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                {dataItem && dataItem.full_name ? (
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[var(--color-slate-200)] dark:bg-[var(--color-slate-600)] text-[var(--text-color)] dark:text-[var(--text-light)] font-bold">
                    {dataItem.full_name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <Image
                    width={100}
                    height={100}
                    className="h-10 w-10 rounded-full object-cover"
                    src="https://placehold.co/40x40/EFEFEF/333333?text=A"
                    alt="Profil rasmi"
                  />
                )}
                <div className="hidden md:block text-left">
                  <div className="font-bold text-[var(--text-color)]">
                    {get(dataItem, "full_name", "Bemor")}
                  </div>
                  <div className="text-sm text-[var(--text-light)]">Bemor</div>
                </div>
              </button>
              {isProfileDropdownOpen && (
                <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-[var(--card-background)] rounded-md shadow-lg py-1 z-10 border border-[var(--border-color)]">
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-[var(--text-color)] hover:bg-[var(--color-slate-100)] dark:hover:bg-[var(--color-slate-600)]"
                  >
                    <i className="bi bi-gear-fill mr-2 text-[var(--text-light)]"></i>
                    Sozlamalar
                  </Link>
                  <div className="border-t border-[var(--border-color)] my-1"></div>
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-slate-100)] dark:hover:bg-[var(--color-slate-600)]"
                  >
                    <i className="bi bi-box-arrow-right mr-2"></i>Chiqish
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 bg-[var(--background-color)] relative overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
      {isSidebarToggled && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarToggled(false)}
        ></div>
      )}
    </div>
  );
}
