import Link from "next/link";
import { useState } from "react";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`sidebar-transition fixed inset-y-0 left-0 z-40 w-[260px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center p-6 mb-2 h-[89px] flex-shrink-0">
          <Link href="/">
            <img
              className="h-[66px] w-auto"
              src="https://raw.githubusercontent.com/ai-med/gemini-generative-ai/main/medmapp_logo_shaffof.png"
              alt="MedMapp Logo"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/150x40/ffffff/0f172a?text=MedMapp";
              }}
            />
          </Link>
        </div>
        <nav className="flex-grow px-6 pb-6 space-y-[5px]">
          <Link
            href="/"
            className="flex items-center py-3 px-4 text-base font-semibold bg-primary text-white rounded-lg"
          >
            <i className="bi bi-grid-1x2-fill mr-3 text-xl"></i>
            <span>Mening profilim</span>
          </Link>
          <Link
            href="/application"
            className="flex items-center py-3 px-4 text-base font-medium text-slate-500 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary-300 rounded-lg"
          >
            <i className="bi bi-file-earmark-medical-fill mr-3 text-xl"></i>
            <span>Arizalarim</span>
          </Link>
          <Link
            href="#"
            className="flex items-center py-3 px-4 text-base font-medium text-slate-500 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary-300 rounded-lg"
          >
            <i className="bi bi-chat-dots-fill mr-3 text-xl"></i>
            <span>Konsultatsiyalar</span>
          </Link>
          <Link
            href="#"
            className="flex items-center py-3 px-4 text-base font-medium text-slate-500 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary-300 rounded-lg"
          >
            <i className="bi bi-star-fill mr-3 text-xl"></i>
            <span>Izohlarim</span>
          </Link>
          <Link
            href="#"
            className="flex items-center py-3 px-4 text-base font-medium text-slate-500 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary-300 rounded-lg"
          >
            <i className="bi bi-gear-fill mr-3 text-xl"></i>
            <span>Sozlamalar</span>
          </Link>
        </nav>
      </aside>
      <div
        id="sidebar-backdrop"
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 ${
          isOpen ? "block" : "hidden"
        } lg:hidden`}
        onClick={toggleSidebar}
      ></div>
    </>
  );
};

export default Sidebar;
