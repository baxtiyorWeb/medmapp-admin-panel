"use client";

import { useEffect, useState, useRef } from "react";
import { AxiosError } from "axios";
import { Loader2, CheckCircle, Info } from "lucide-react";
import api from "@/utils/api";
import LoadingOverlay from "@/components/LoadingOverlay";

interface PatientProfile {
  id: number | null;
  full_name: string | null;
  passport: string | null;
  dob: string | null;
  gender: "male" | "female" | null;
  phone: string | null;
  email: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const getMyProfile = async (): Promise<PatientProfile> => {
  const response = await api.get("/patients/profile/me/");
  return response.data;
};

const updateMyProfile = async (
  data: Partial<PatientProfile>
): Promise<PatientProfile> => {
  const response = await api.patch("/patients/profile/me/", data);
  return response.data;
};

const formatPhoneNumber = (phoneNumber: string | null): string => {
  if (!phoneNumber) return "";
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^998(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+998 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
  }
  return phoneNumber;
};

const fieldNamesUz: { [key: string]: string } = {
  full_name: "To'liq ism",
  email: "Elektron pochta",
  passport: "Passport",
};

const translateError = (fieldKey: string, englishMessage: string): string => {
  const fieldName = fieldNamesUz[fieldKey] || fieldKey;

  if (englishMessage.includes("may not be blank")) {
    return `${fieldName} maydoni to'ldirilishi shart.`;
  }
  if (englishMessage.includes("may not be null")) {
    return `${fieldName} maydoni bo'sh bo'lmasligi kerak.`;
  }
  if (englishMessage.includes("Enter a valid email")) {
    return `Iltimos, yaroqli ${fieldName.toLowerCase()} manzilini kiriting.`;
  }

  return englishMessage;
};

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const [profile, setProfile] = useState<Partial<PatientProfile>>({});
  const [initialProfile, setInitialProfile] = useState<Partial<PatientProfile>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getMyProfile();
        const formattedData = { ...data, phone: formatPhoneNumber(data.phone) };
        setProfile(formattedData);
        setInitialProfile(formattedData);
      } catch (err) {
        setGeneralError("Ma'lumotlarni yuklab bo'lmadi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setErrors({});
    setGeneralError(null);
    setNotification(null);

    const changedData: Partial<PatientProfile> = {};
    const keys = Object.keys(profile) as Array<keyof PatientProfile>;

    for (const key of keys) {
      if (profile[key] !== initialProfile[key]) {
        // Xatolikni tuzatish uchun shu qator o'zgartirildi
        (changedData as any)[key] = profile[key];
      }
    }

    if (Object.keys(changedData).length > 0) {
      try {
        const updatedProfile = await updateMyProfile(changedData);
        const formatted = {
          ...updatedProfile,
          phone: formatPhoneNumber(updatedProfile.phone),
        };
        setProfile(formatted);
        setInitialProfile(formatted);
        setNotification({
          message: "Ma'lumotlar muvaffaqiyatli saqlandi!",
          type: "success",
        });
      } catch (err) {
        const axiosError = err as AxiosError<any>;
        const responseData = axiosError.response?.data;

        if (
          responseData &&
          typeof responseData === "object" &&
          !Array.isArray(responseData)
        ) {
          const newErrors: { [key: string]: string } = {};
          for (const key in responseData) {
            if (
              Array.isArray(responseData[key]) &&
              responseData[key].length > 0
            ) {
              const englishError = responseData[key][0];
              newErrors[key] = translateError(key, englishError);
            }
          }
          setErrors(newErrors);
        } else {
          const errorMsg =
            responseData?.detail ||
            (Array.isArray(responseData)
              ? responseData[0]
              : "Noma'lum xatolik yuz berdi.");
          setGeneralError(errorMsg);
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      setNotification({
        message: "Hech qanday o'zgarish kiritilmadi.",
        type: "info",
      });
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const isDark = localStorage.getItem("medmapp_dark") === "true";
    setIsDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
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

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <div className="flex h-auto overflow-hidden ">
        <div className="flex-1 flex flex-col overflow-hidden ">
          <main className="flex-1">
            <div className="mx-auto space-y-3">
              <div className="bg-[var(--card-background)] rounded-2xl shadow-lg">
                <div className="p-6 border-b border-[var(--border-color)]">
                  <h2 className="text-lg font-bold text-[var(--text-color)]">
                    Profil Sozlamalari
                  </h2>
                  <p className="text-sm text-[var(--text-color)]">
                    Shaxsiy ma&apos;lumotlaringizni yangilang.
                  </p>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-6">
                    <img
                      className="h-20 w-20 rounded-full object-cover"
                      src="https://placehold.co/80x80/EFEFEF/333333?text=A"
                      alt="Profil rasmi"
                    />
                    <div>
                      <button className="bg-[#4153F1] cursor-pointer text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition">
                        Rasm yuklash
                      </button>
                      <button className="text-sm text-[var(--text-color)] hover:text-danger ml-3">
                        O&apos;chirish
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="full_name"
                        className="text-sm font-medium text-[var(--text-color)] mb-1 block"
                      >
                        To&apos;liq ism
                      </label>
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={profile.full_name || ""}
                        onChange={handleInputChange}
                        className={`w-full p-3 border bg-[var(--input-bg)] rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                          errors.full_name
                            ? "border-red-500"
                            : "border-[var(--border-color)]"
                        }`}
                      />
                      {errors.full_name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.full_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-[var(--text-color)] mb-1 block"
                      >
                        Elektron pochta
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email || ""}
                        onChange={handleInputChange}
                        className={`w-full p-3 border bg-[var(--input-bg)] rounded-lg focus:ring-2 focus:ring-primary focus:outline-none ${
                          errors.email
                            ? "border-red-500"
                            : "border-[var(--border-color)]"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium text-[var(--text-color)] mb-1 block"
                      >
                        Telefon raqam (kirish uchun)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profile.phone || ""}
                        className="w-full p-3 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="region"
                        className="text-sm font-medium text-[var(--text-color)] mb-1 block"
                      >
                        Viloyat
                      </label>
                      <select
                        id="region"
                        name="region"
                        className="w-full p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-lg focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                      >
                        <option>Toshkent shahri</option>
                        <option selected>Surxondaryo viloyati</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[var(--card-background)] rounded-b-2xl">
                  {generalError && (
                    <p className="text-red-500 text-sm mb-4">{generalError}</p>
                  )}
                  <div className="flex items-center justify-end gap-4">
                    <div
                      className={`transition-opacity duration-300 ${
                        notification ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {notification && (
                        <div
                          className={`flex items-center gap-2 text-sm ${
                            notification.type === "success"
                              ? "text-green-600"
                              : "text-blue-500"
                          }`}
                        >
                          {notification.type === "success" ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Info className="w-5 h-5" />
                          )}
                          <span>{notification.message}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                      className="bg-[#4153F1] text-white cursor-pointer font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
                    >
                      {isSaving && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      {isSaving ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--card-background)] rounded-2xl shadow-lg border-2 border-[#EF4444]/20">
                <div className="p-6 border-b border-[var(--border-color)]">
                  <h2 className="text-lg font-bold text-[#EF4444]">
                    Xavfli Hudud
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div className="mb-3 sm:mb-0">
                      <h4 className="font-semibold text-[var(--text-color)]">
                        Hisobni o&apos;chirish
                      </h4>
                      <p className="text-sm text-[var(--text-color)]">
                        Hisobingiz o&apos;chirilgach, uni qayta tiklab bo&apos;lmaydi.
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
