"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  LayoutDashboard,
  Calendar,
  Stethoscope,
  MessageSquare,
  Settings,
  LogOut,
  Search,
  Bell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsFillGrid1X2Fill, BsGrid3X2Gap } from "react-icons/bs";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden">
      {/* Sidebar Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          id="sidebar-backdrop"
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`sidebar-transition fixed inset-y-0 left-0 z-40 w-[260px] bg-white border-r border-slate-200 flex flex-col transform
          ${
            !isMobile
              ? isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center p-6 mb-2 h-[89px] flex-shrink-0">
          <Link href="/">
            <Image
              className="h-[66px] w-auto"
              width={150}
              height={66}
              src="https://medmapp.netlify.app/images/MedMapp_Logo_shaffof.png"
              alt="MedMapp Logo"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/150x40/ffffff/0f172a?text=MedMapp";
              }}
            />
          </Link>
        </div>

        {/* Navigation */}
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
            className="text-red-500 absolute bottom-10"
            active={pathname === "/login"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
        </nav>
      </aside>

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out
        ${!isMobile && isSidebarOpen ? "ml-[260px]" : "ml-0"}
      `}
      >
        <header className="flex items-center justify-between py-4 px-8 bg-white border-b border-slate-200 h-[89px] flex-shrink-0">
          <button onClick={() => setIsSidebarOpen((prev) => !prev)}>
            <Menu size={32} className="text-slate-500 hover:text-slate-700" />
          </button>
          <div className="flex items-center space-x-5">
            <button className="text-slate-500 hover:text-primary">
              <Search size={20} />
            </button>
            <button className="text-slate-500 hover:text-primary">
              <Bell size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-4">
              <div className="bg-primary text-white w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-semibold">
                SN
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-bold text-slate-700">
                  Dr. Salima Nosirova
                </span>
                <span className="text-slate-500">Kardiolog</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({
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
        ? "bg-[#4153F1] text-white leading-[6px]  font-[Inter] font-semibold"
        : "text-slate-500 hover:bg-primary-50 hover:text-primary"
    } ${className}`}
  >
    <div className="flex items-center justify-center  ">
      <Icon
        size={20}
        className={`mr-3 text-xl ${active ? "text-white" : "text-slate-500"}`}
      />
    </div>
    {open && (
      <span className={` ${active ? "text-white" : "text-slate-500"}`}>
        {text}
      </span>
    )}
  </Link>
);

export default DashboardLayout;
