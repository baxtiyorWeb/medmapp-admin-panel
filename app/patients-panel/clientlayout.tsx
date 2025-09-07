// Fayl manzili: app/patients-panel/DashboardClientLayout.tsx

"use client"; // Bu komponentni client komponenti sifatida belgilaydi
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Stethoscope,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { get, isArray } from "lodash";
import useProfile from "@/hooks/useProfile";
import LoadingOverlay from "@/components/LoadingOverlay";
import "./../../components/patients/style.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardClientLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { fetchProfile } = useProfile();

  const { data, isLoading } = useQuery({
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

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden">
      {isMobile && (
        <div
          id="sidebar-backdrop"
          className={`fixed inset-0 bg-black/80 z-30 transition-opacity duration-300 ease-in-out ${
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
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
        <nav className="flex-grow px-6 pb-6 space-y-[5px]">
          <SidebarItem
            link="/patients-panel"
            icon={BsFillGrid1X2Fill}
            text="Mening profilim"
            open={isSidebarOpen}
            active={pathname === "/patients-panel"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/patients-panel/applications"
            icon={Calendar}
            text="Arizalarim"
            open={isSidebarOpen}
            active={pathname === "/patients-panel/applications"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/patients-panel/consultations"
            icon={MessageSquare}
            text="Konsultatsiyalar"
            open={isSidebarOpen}
            active={pathname === "/patients-panel/consultations"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/patients-panel/reviews"
            icon={Stethoscope}
            text="Izohlarim"
            open={isSidebarOpen}
            active={pathname === "/patients-panel/reviews"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/patients-panel/settings"
            icon={Settings}
            text="Sozlamalar"
            open={isSidebarOpen}
            active={pathname === "/patients-panel/settings"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/login"
            icon={LogOut}
            text="Chiqish"
            open={isSidebarOpen}
            className="bg-red-500/10 border border-red-500  hover:bg-red-500/30 text-white w-[80%] absolute bottom-10 rounded-lg transition-colors"
            active={pathname === "/login"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
        </nav>
      </aside>

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "ml-0 md:ml-[260px]" : "ml-0"}
        `}
      >
        <header className="flex items-center justify-between py-4 px-8 bg-white border-b border-slate-200 h-[89px] flex-shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              id="sidebar-toggle"
              className="-ml-2 mr-4 text-slate-500 hover:text-slate-700"
            >
              <i className="bi bi-list text-3xl"></i>
            </button>
            <h1 className="hidden md:block text-2xl font-semibold text-slate-800">
              Boshqaruv Paneli
            </h1>
          </div>
          <div className="flex items-center space-x-3 md:space-x-5">
            <div className="relative">
              <button className="lang-toggle cursor-pointer text-slate-500 hover:text-primary">
                <i className="bi bi-translate text-xl"></i>
              </button>
            </div>
            <button
              id="dark-mode-toggle"
              className="text-slate-500 cursor-pointer hover:text-primary"
            >
              <i className="bi bi-moon-stars-fill text-xl"></i>
            </button>
            <button className="text-slate-500 cursor-pointer hover:text-primary">
              <i className="bi bi-bell text-xl"></i>
            </button>
            <div className="relative">
              <button
                className="profile-toggle cursor-pointer flex items-center space-x-3"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                {dataItem && dataItem.full_name ? (
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-800 font-bold">
                    {dataItem.full_name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src="https://placehold.co/40x40/EFEFEF/333333?text=A"
                    alt="Profil rasmi"
                  />
                )}
                <div className="hidden md:block text-left">
                  <div className="font-bold text-slate-700">
                    {get(dataItem, "full_name", "Bemor")}
                  </div>
                  <div className="text-sm text-slate-500">Bemor</div>
                </div>
              </button>
              {isProfileDropdownOpen && (
                <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    <i className="bi bi-gear-fill mr-2 text-slate-500"></i>
                    Sozlamalar
                  </Link>
                  <div className="border-t border-slate-200 my-1"></div>
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-slate-100"
                  >
                    <i className="bi bi-box-arrow-right mr-2"></i>Chiqish
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 relative overflow-y-auto p-6 md:p-8 bg-slate-100">
          {isLoading ? <LoadingOverlay /> : children}
        </main>
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
  open: boolean;
  className?: string;
  active?: boolean;
  link?: string;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  text,
  open,
  className = "",
  active = false,
  link = "",
  onClick,
}) => (
  <Link
    href={link}
    onClick={onClick}
    className={`flex items-center py-4 px-4 text-base font-semibold text-white rounded-lg ${
      active
        ? "bg-[#4153F1] text-white leading-[6px] font-[Inter] font-semibold"
        : "text-slate-500 hover:bg-primary-50 hover:text-primary"
    } ${className}`}
  >
    <div className="flex items-center justify-center">
      <Icon
        size={20}
        className={`mr-3 text-xl ${active ? "text-white" : "text-slate-500"}`}
      />
    </div>
    {open && (
      <span className={`${active ? "text-white" : "text-slate-500"}`}>
        {text}
      </span>
    )}
  </Link>
);

export default DashboardClientLayout; 
