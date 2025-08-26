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
<<<<<<< HEAD
import { BsFillGrid1X2Fill, BsGrid3X2Gap } from "react-icons/bs";

const DashboardLayout = ({ children }) => {
=======

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
>>>>>>> 619ee19 (Initial commit)
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
<<<<<<< HEAD
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden">
      {/* Sidebar Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          id="sidebar-backdrop"
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
=======
    <div className="flex min-h-screen relative bg-[#F0F2F5] overflow-hidden">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-40 z-30"
>>>>>>> 619ee19 (Initial commit)
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

<<<<<<< HEAD
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
=======
      <aside
        className={`bg-white transition-all duration-300 border-r border-gray-200  z-40 ${
          isMobile
            ? isSidebarOpen
              ? "fixed inset-y-0 left-0 w-[280px]"
              : " transition-all duration-300"
            : isSidebarOpen
            ? "w-[280px]"
            : "w-[80px] "
        }`}
      >
        <div
          className={`h-[66px] flex items-center justify-center mt-[20px] mb-[70px] transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "ml-[20px] w-[199px]" : "ml-0 w-[80px]"
          }`}
        >
          <Link href={"/"}>
            <Image
              className={`transition-all duration-300 object-contain ${
                isSidebarOpen ? "h-[66px] w-auto" : "h-[40px] w-auto"
              }`}
              width={isSidebarOpen ? 100 : 40}
              height={isSidebarOpen ? 66 : 40}
              src={
                isSidebarOpen
                  ? "https://medmapp.uz/images/MedMapp_Logo_shaffof.png"
                  : "http://127.0.0.1:5500/images/favicon.png"
              }
              alt="logo"
>>>>>>> 619ee19 (Initial commit)
            />
          </Link>
        </div>

<<<<<<< HEAD
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
=======
        <nav className="flex-1 flex flex-col space-y-1 px-4">
          <SidebarItem
            link="/patients-panel"
            icon={LayoutDashboard}
            text="Boshqaruv Paneli"
            open={isSidebarOpen}
            active={pathname === "/"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/schedule"
            icon={Calendar}
            text="Kun Tartibi"
            open={isSidebarOpen}
            active={pathname === "/schedule"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/patients"
            icon={Stethoscope}
            text="Bemorlar"
            open={isSidebarOpen}
            active={pathname === "/patients"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/messages"
            icon={MessageSquare}
            text="Xabarlar"
            open={isSidebarOpen}
            active={pathname === "/messages"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/settings"
            icon={Settings}
            text="Profil Sozlamalari"
            open={isSidebarOpen}
            active={pathname === "/settings"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
        </nav>

        <div className="p-4 mt-auto">
          <SidebarItem
>>>>>>> 619ee19 (Initial commit)
            link="/login"
            icon={LogOut}
            text="Chiqish"
            open={isSidebarOpen}
<<<<<<< HEAD
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
=======
            className="text-[#E74C3C] absolute bottom-10"
            active={pathname === "/login"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-h-screen">
        <header className="h-[70px] bg-white flex items-center px-4 md:px-6 justify-between sticky top-0 z-10 border-b border-gray-200">
          <button onClick={() => setIsSidebarOpen((prev) => !prev)}>
            <Menu size={24} className="text-gray-500 cursor-pointer" />
          </button>
          <div className="flex items-center gap-4 md:gap-6">
            <button className="text-gray-500 hover:text-blue-500">
              <Search size={20} />
            </button>
            <button className="text-gray-500 hover:text-blue-500">
              <Bell size={20} />
            </button>
            <button className="text-gray-500 hover:text-blue-500">
              <Settings size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 border-l border-gray-200 pl-4">
              <div className="bg-[#3E79F7] text-white w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-sm font-semibold">
                SN
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold text-gray-800">
                  Dr. Salima Nosirova
                </span>
                <span className="text-gray-500 text-xs">Kardiolog</span>
>>>>>>> 619ee19 (Initial commit)
              </div>
            </div>
          </div>
        </header>

<<<<<<< HEAD
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-100">
=======
        <main className="p-4 md:p-6 flex-1 bg-[#F6F9FE] overflow-auto">
>>>>>>> 619ee19 (Initial commit)
          {children}
        </main>
      </div>
    </div>
  );
};

<<<<<<< HEAD
const SidebarItem = ({
=======
interface SidebarItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
  open: boolean;
  className?: string;
  active?: boolean;
  link: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
>>>>>>> 619ee19 (Initial commit)
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
<<<<<<< HEAD
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
=======
    className={`flex items-center h-[50px] py-[10px] px-[12px] rounded-lg cursor-pointer transition-colors duration-200 ${
      active
        ? "bg-[#4153F1] text-white font-semibold "
        : "text-gray-600 hover:bg-gray-100"
    } ${className}`}
  >
    <div
      className={`flex items-center justify-center w-10 h-10 ${
        active ? "text-white" : "text-gray-600"
      }`}
    >
      <Icon
        size={20}
        className="font-semibold leading-[30px] h-[30px]  w-[24px]"
      />
    </div>
    {open && (
      <span
        className={`text-[15px] font-[Inter] ${active ? "text-white" : ""}`}
      >
>>>>>>> 619ee19 (Initial commit)
        {text}
      </span>
    )}
  </Link>
);

export default DashboardLayout;
