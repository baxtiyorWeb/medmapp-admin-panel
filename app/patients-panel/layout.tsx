"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar, MessageSquare, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { get } from "lodash";
import { useProfile } from "@/hooks/useProfile";
import LoadingOverlay from "@/components/LoadingOverlay";
import "./../../components/patients/style.css";
import { BiBasket } from "react-icons/bi";
import { SidebarItem } from "@/components/SidebarItem";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useDarkModeContext } from "@/providers/DarkThemeProvider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false); // Boshlang'ich holat
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleDarkMode } = useDarkModeContext();
  const pathname = usePathname();
  const router = useRouter();

  const { profile, isLoading } = useProfile();

  const [imgSrc, setImgSrc] = useState("/assets/MedMapp_Logo_shaffof.png");
  // YECHIM: Ekranni o'lchamini aniqlash uchun yangi useEffect
  useEffect(() => {
    // Bu funksiya ekran kengligini tekshiradi
    const handleResize = () => {
      const mobile = window.innerWidth < 768; // Tailwind'dagi 'md' breakpoint
      setIsMobile(mobile);
      // Agar ekran mobil o'lchamda bo'lsa, sidebar'ni yopib qo'yamiz
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Komponent ilk marta yuklanganda funksiyani ishga tushiramiz
    handleResize();

    // Har safar ekran o'lchami o'zgarganda funksiyani chaqiramiz
    window.addEventListener("resize", handleResize);

    // Komponent DOM'dan o'chirilganda event listener'ni tozalaymiz
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Bo'sh massiv [] - bu effekt faqat bir marta, komponent yuklanganda ishga tushishini bildiradi

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.15, ease: "easeIn" },
    },
  };

  return (
    <div className="flex h-screen bg-[var(--background-color)] text-[var(--text-color)] overflow-hidden">
      {/* Sidebar uchun qora fon (faqat mobilda ko'rinadi) */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            id="sidebar-backdrop"
            className="fixed inset-0 bg-black/80 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-[var(--card-background)] flex flex-col border-r border-[var(--border-color)] transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center p-6 mb-2 h-[89px] flex-shrink-0">
          <Link href="/">
            <Image
              className="h-[66px] w-auto rounded-lg"
              width={150}
              height={66}
              src={imgSrc}
              alt="MedMapp Logo"
              onError={() =>
                setImgSrc(
                  "https://placehold.co/150x40/ffffff/0f172a?text=MedMapp"
                )
              }
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
            link="/patients-panel/orders"
            icon={BiBasket}
            text="Buyurtmalarim"
            open={isSidebarOpen}
            active={pathname === "/patients-panel/orders"}
            onClick={() => isMobile && setIsSidebarOpen(false)}
          />
          <SidebarItem
            link="/patients-panel/consultations"
            icon={MessageSquare}
            text="Chat"
            open={isSidebarOpen}
            active={pathname === "/patients-panel/consultations"}
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

          <div className="absolute bottom-10 w-[calc(100%-48px)]">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full  cursor-pointer flex items-center p-3 text-sm font-semibold rounded-lg transition-colors duration-200 text-red-500 bg-red-500/10 hover:bg-red-500/20"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Chiqish</span>
            </button>
          </div>
        </nav>
      </aside>

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen && !isMobile ? "ml-[260px]" : "ml-0"
          }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between py-4 px-8 bg-[var(--card-background)] border-b border-[var(--border-color)] h-[89px] flex-shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              id="sidebar-toggle"
              className="text-[var(--text-light)] hover:text-[var(--text-color)] -ml-2 mr-4"
            >
              <i className="bi bi-list text-3xl"></i>
            </button>
            <h1 className="hidden md:block text-2xl font-semibold text-[var(--text-color)]">
              Boshqaruv paneli
            </h1>
          </div>
          <div className="flex items-center space-x-3 md:space-x-5">
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

            {/* Profile section */}
            <div className="relative" ref={profileRef}>
              <button
                className="profile-toggle cursor-pointer flex items-center space-x-3"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                {get(profile, "avatar_url") ? (
                  <Image
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                    src={get(profile, "avatar_url") || "/assets/user_avatar.png"}
                    alt="Profil rasmi"
                  />
                ) : (
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold">
                    {get(profile, "full_name", "B").charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="hidden md:block text-left">
                  <div className="font-bold text-[var(--text-color)]">
                    {get(profile, "full_name", "Bemor")}
                  </div>
                  <div className="text-sm text-[var(--text-light)]">Bemor</div>
                </div>
              </button>
              {isProfileDropdownOpen && (
                <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-[var(--card-background)] rounded-md shadow-lg py-1 z-10 border border-[var(--border-color)]">
                  <Link
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-[var(--text-color)]  hover:bg-[var(--input-bg)]"
                  >
                    <i className="bi bi-gear-fill mr-2 text-[var(--text-light)]"></i>
                    Sozlamalar
                  </Link>
                  <div className="border-t border-[var(--border-color)] my-1"></div>
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="w-full  cursor-pointer text-left flex items-center px-4 py-2 hover:bg-[var(--input-bg)] text-sm text-[var(--color-danger)] "
                  >
                    <i className="bi bi-box-arrow-right mr-2"></i>Chiqish
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto p-6 md:p-8">
          {isLoading ? <LoadingOverlay /> : children}
        </main>
      </div>

      {/* Chiqish uchun Modal */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[var(--card-background)] rounded-2xl shadow-xl w-full max-w-md p-8 text-center border border-[var(--border-color)]"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-5">
                <i className="bi bi-exclamation-triangle-fill text-3xl text-red-500"></i>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-color)] mb-2">
                Ishonchingiz komilmi?
              </h3>
              <p className="text-[var(--text-light)] mb-8">
                Siz profilingizdan chiqmoqchisiz. Bu amalni tasdiqlaysizmi?
              </p>
              <div className="grid grid-cols-2 gap-x-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="bg-[#475569] text-sm text-white font-bold py-2 px-5 rounded-lg hover:bg-[#64748B] transition cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full cursor-pointer py-2 px-3  text-sm rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Ha, chiqish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
