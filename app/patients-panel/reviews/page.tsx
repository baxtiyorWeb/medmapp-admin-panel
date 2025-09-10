"use client";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { BsStarFill } from "react-icons/bs";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden ">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Rating Summary */}
              <div className="lg:col-span-4">
                <div className="bg-[var(--card-background)] rounded-2xl shadow-lg p-6 text-center">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    AKFA MEDLINE KLINIKASI
                  </h3>
                  <p className="text-6xl font-bold text-[var(--text-color)] my-2">4.8</p>
                  <div className="star-rating text-2xl mb-2 flex justify-center items-center">
                    <BsStarFill className="text-[#F59E0B] "/>
                    <BsStarFill className="text-[#F59E0B] "/>
                    <BsStarFill className="text-[#F59E0B] "/>
                    <BsStarFill className="text-[#F59E0B] "/>
                    <BsStarFill className="text-[#F59E0B] "/>
                  </div>
                  <p className="text-sm text-slate-500">152 ta izoh asosida</p>
                  <hr className="my-6 border-[var(--border-color)]" />
                  <div className="rating-breakdown text-left space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2 ">
                        <span className="text-sm text-slate-500 ">
                          {star} <BsStarFill className="my-1 text-sm"/>
                        </span>
                        <div className="w-full bg-[var(--input-bg)] rounded-full h-2">
                          <div
                            className="progress-bar rounded-full h-2"
                            style={{
                              width: `${
                                star === 5
                                  ? 80
                                  : star === 4
                                  ? 15
                                  : star === 3
                                  ? 3
                                  : 1
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-8">
                <div className="bg-[var(--card-background)] rounded-2xl shadow-lg">
                  <div className="p-4 sm:p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h2 className="text-lg font-bold text-[var(--text-color)]">
                      Barcha izohlar (152)
                    </h2>
                    <button
                      onClick={() => setIsReviewModalOpen(true)}
                      className="bg-primary text-[var(--text-color)] font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
                    >
                      <i className="bi bi-pencil-square"></i> Izoh qoldirish
                    </button>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {/* Review 1 */}
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src="https://placehold.co/48x48/EFEFEF/333333?text=S"
                          className="rounded-full flex-shrink-0"
                          alt="Avatar"
                        />
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-[var(--text-color)]">
                              Sarvinoz Karimova
                            </h4>
                            <p className="text-sm text-slate-500">
                              2 kun oldin
                            </p>
                          </div>
                          <div className="star-rating text-sm my-1">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className="bi bi-star-fill"></i>
                            ))}
                          </div>
                          <p className="text-slate-600">
                            Juda ajoyib klinika, shifokorlar juda professional.
                            Ayniqsa, Dr. Karim Anvarovga alohida rahmat.
                            Davolanish jarayoni yuqori saviyada tashkil etilgan.
                          </p>
                          <img
                            src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400"
                            alt="Video review thumbnail"
                            className="mt-3 rounded-lg w-40 h-24 object-cover cursor-pointer hover:opacity-80 transition"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Review 2 */}
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src="https://placehold.co/48x48/EFEFEF/333333?text=A"
                          className="rounded-full flex-shrink-0"
                          alt="Avatar"
                        />
                        <div className="flex-grow">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-[var(--text-color)]">
                              Ali Valiyev
                            </h4>
                            <p className="text-sm text-slate-500">
                              1 hafta oldin
                            </p>
                          </div>
                          <div className="star-rating text-sm my-1">
                            {[...Array(4)].map((_, i) => (
                              <i key={i} className="bi bi-star-fill"></i>
                            ))}
                            <i className="bi bi-star-half"></i>
                          </div>
                          <p className="text-slate-600">
                            Xizmat ko&apos;rsatish sifati yaxshi, lekin ro&apos;yxatdan
                            o&apos;tish joyida biroz kutib qoldim. Umuman olganda,
                            tavsiya qilaman.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Review Modal */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-[var(--card-background)] rounded-2xl shadow-2xl w-full max-w-lg mx-4">
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
                <h3 className="text-xl font-semibold text-[var(--text-color)]">
                  Fikr bildirish
                </h3>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 -mt-2 -mr-2"
                >
                  <i className="bi bi-x-lg text-2xl"></i>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Bahoyingiz
                  </label>
                  <div
                    className="flex items-center text-3xl"
                    data-rating={rating}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <i
                        key={value}
                        className={`bi bi-star${
                          rating >= value ? "-fill" : ""
                        } cursor-pointer`}
                        onClick={() => handleRatingClick(value)}
                      ></i>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="reviewText"
                    className="text-sm font-medium text-slate-700 mb-1 block"
                  >
                    Izohingiz
                  </label>
                  <textarea
                    id="reviewText"
                    rows={4}
                    placeholder="Klinika va shifokorlar haqidagi fikrlaringiz..."
                    className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  ></textarea>
                </div>
                <div>
                  <label
                    htmlFor="videoFile"
                    className="text-sm font-medium text-slate-700 mb-1 block"
                  >
                    Video-mulohaza (ixtiyoriy)
                  </label>
                  <input
                    type="file"
                    id="videoFile"
                    accept="video/*"
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end p-5 border-t border-[var(--border-color)] bg-slate-50 rounded-b-2xl space-x-3">
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="bg-[var(--input-bg)] text-[var(--text-color)] font-bold py-2 px-5 rounded-lg hover:bg-slate-300 transition"
                >
                  Bekor qilish
                </button>
                <button className="bg-primary text-[var(--text-color)] font-bold py-2 px-5 rounded-lg hover:bg-primary-600 transition">
                  Yuborish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
