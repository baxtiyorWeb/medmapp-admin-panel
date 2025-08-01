"use client";
import React, { useState } from "react";
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
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// ... (boshqa importlar o'zgarishsiz)
import { usePathname } from "next/navigation"; // <-- YANGI

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname(); // <-- YANGI

  return (
    <div
      className="grid min-h-screen bg-[#F0F2F5] transition-all duration-300"
      style={{
        gridTemplateColumns: isSidebarOpen ? "280px 1fr" : "80px 1fr",
      }}
    >
      <aside className="bg-white h-screen sticky top-0 flex flex-col border-r border-gray-200">
        <div className="h-16 mb-[56px] mt-[16px] flex items-center justify-center font-bold text-blue-700 text-lg border-gray-200">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2">
              <Link href={"/"}>
                <Image
                  className="h-[66px] w-full"
                  width={100}
                  height={100}
                  src="https://medmapp.uz/images/MedMapp_Logo_shaffof.png"
                  alt=""
                />
              </Link>
            </div>
          ) : (
            <Link href={"/"}>
              <Image
                className="h-[4.5rem] w-full"
                width={100}
                height={100}
                src="http://127.0.0.1:5500/images/favicon.png"
                alt=""
              />
            </Link>
          )}
        </div>
        <nav className="mt-6 flex-1 flex flex-col space-y-2 px-4">
          <SidebarItem
            link="/"
            icon={LayoutDashboard}
            text="Boshqaruv Paneli"
            open={isSidebarOpen}
            active={pathname === "/"} // <-- BU YERDA O'ZGARTIRILGAN
          />
          <SidebarItem
            link="/schedule"
            icon={Calendar}
            text="Kun Tartibi"
            open={isSidebarOpen}
            active={pathname === "/schedule"} // <-- BU YERDA O'ZGARTIRILGAN
          />
          <SidebarItem
            link="/patients"
            icon={Stethoscope}
            text="Bemorlar"
            open={isSidebarOpen}
            active={pathname === "/patients"} // <-- BU YERDA O'ZGARTIRILGAN
          />
          <SidebarItem
            link="/messages"
            icon={MessageSquare}
            text="Xabarlar"
            open={isSidebarOpen}
            active={pathname === "/messages"} // <-- BU YERDA O'ZGARTIRILGAN
          />
          <SidebarItem
            link="/settings"
            icon={Settings}
            text="Profil Sozlamalari"
            open={isSidebarOpen}
            active={pathname === "/settings"} // <-- BU YERDA O'ZGARTIRILGAN
          />
        </nav>
        <div className="p-4 mt-auto">
          <SidebarItem
            link="/login"
            icon={LogOut}
            text="Chiqish"
            open={isSidebarOpen}
            className="text-[#E74C3C]"
            active={pathname === "/login"}
          />
        </div>
      </aside>

      <div className="flex flex-col min-h-screen">
        {/* ... Header va Main qismi o'zgarishsiz qoladi */}
        <header className="h-[70px] bg-white flex items-center px-6 justify-between sticky top-0 z-10 border-b border-gray-200">
          <button onClick={() => setIsSidebarOpen((prev) => !prev)}>
            <Menu size={24} className="text-gray-500 cursor-pointer" />
          </button>
          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:text-blue-500">
              <Search size={20} />
            </button>
            <button className="text-gray-500 hover:text-blue-500">
              <Bell size={20} />
            </button>
            <button className="text-gray-500 hover:text-blue-500">
              <Settings size={20} />
            </button>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
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
        <main className="p-[30px] flex-1 bg-white">{children}</main>
      </div>
    </div>
  );
};
// ... SidebarItem komponenti o'zgarishsiz qoladi
interface SidebarItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
  open: boolean;
  className?: string;
  active?: boolean;
  link: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  text,
  open,
  className = "",
  active = false,
  link = "",
}) => (
  <Link
    href={`${link}`}
    className={`flex items-center h-[50px] py-[10px] px-[12px] rounded-lg cursor-pointer transition-colors duration-200 ${
      active
        ? "bg-[#3D4FE4] text-white font-semibold "
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
        className={`text-[15px] font-[Inter]  ${active ? "text-white" : ""}`}
      >
        {text}
      </span>
    )}
  </Link>
);

export default DashboardLayout;
