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

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
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
    <div className="flex min-h-screen relative bg-[#F0F2F5] overflow-hidden">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-40 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

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
            />
          </Link>
        </div>

        <nav className="flex-1 flex flex-col space-y-1 px-4">
          <SidebarItem
            link="/"
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
            link="/login"
            icon={LogOut}
            text="Chiqish"
            open={isSidebarOpen}
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
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6 flex-1 bg-[#F6F9FE] overflow-auto">
          {children}
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
  link: string;
  onClick?: () => void;
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
        {text}
      </span>
    )}
  </Link>
);

export default DashboardLayout;
