"use client";

import { useEffect, useState, useRef } from "react";
// import { AxiosError } from "axios";
import { Loader2, CheckCircle, Info, Upload, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import LoadingOverlay from "@/components/LoadingOverlay";
import _ from "lodash";
import {
  PatientProfile,
  useProfile,
  useUpdateProfile,
  useUploadAvatar, // Yangi hook
  useDeleteAvatar, // Yangi hook
} from "@/hooks/useProfile"; // hooklar shu fayldan import qilinadi deb faraz qilindi
import Image from "next/image";
import Notification from "@/components/patients/notification-modal";

// Telefon raqamini formatlash funksiyasi
const formatPhoneNumber = (phoneNumber: string | null): string => {
  if (!phoneNumber) return "";
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");
  const match = cleaned.match(/^998(\d{2})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+998 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
  }
  return phoneNumber;
};

// Maydon nomlarini o'zbekchaga tarjima qilish uchun obyekt
const fieldNamesUz: { [key: string]: string } = {
  full_name: "To'liq ism",
  email: "Elektron pochta",
  passport: "Passport",
  region: "Viloyat",
  avatar: "Avatar",
};

// Xatoliklarni tarjima qilish funksiyasi
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
  // Avatar uchun maxsus xatoliklar
  if (englishMessage.includes("Upload a valid image")) {
    return "Iltimos, yaroqli rasm faylini tanlang (JPG, PNG, va hokazo).";
  }

  return englishMessage;
};

const Settings: React.FC = () => {
  const queryClient = useQueryClient();
  const { profile: initialProfile, isLoading, isError } = useProfile();

  const [profile, setProfile] = useState<Partial<PatientProfile>>({});
  const [initialProfileState, setInitialProfileState] = useState<
    Partial<PatientProfile>
  >({});

  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar(); // Avatar yuklash uchun mutation
  const deleteAvatarMutation = useDeleteAvatar(); // Avatar o'chirish uchun mutation

  // Avatar uchun state'lar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);

  // Dastlabki profil ma'lumotlarini state'ga yuklash
  useEffect(() => {
    if (initialProfile) {
      const formattedData: Partial<PatientProfile> = {
        ...initialProfile,
        phone: formatPhoneNumber(initialProfile.phone),
      };
      setProfile(formattedData);
      setInitialProfileState(formattedData);
    }
  }, [initialProfile]);

  // Bildirishnomalarni 5 soniyadan keyin yashirish
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fayl tanlanganda preview yaratish
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, avatar: "" })); // Agar avval xatolik bo'lsa, tozalash
    }
  };

  // "Rasm yuklash" tugmasi bosilganda yashirin input'ni ochish
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Avatarni serverga yuklash
  const handleAvatarUpload = () => {
    if (selectedFile) {
      uploadAvatarMutation.mutate(selectedFile, {
        onSuccess: (updatedProfile) => {
          queryClient.setQueryData(["profile"], updatedProfile); // Keshni yangilash
          setSelectedFile(null);
          setPreviewUrl(null);
          setNotification({
            message: "Avatar muvaffaqiyatli yangilandi!",
            type: "success",
          });
        },
        onError: () => {
          // translateError('avatar', err.message);
        },
      });
    }
  };

  // Avatarni o'chirish
  const handleAvatarDelete = () => {
    deleteAvatarMutation.mutate(undefined, {
      onSuccess: () => {
        // Profil ma'lumotlarini qayta yuklash uchun keshni bekor qilish
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        setNotification({
          message: "Avatar muvaffaqiyatli o'chirildi!",
          type: "success",
        });
      },
      onError: () => {
        setGeneralError("Avatarni o'chirishda xatolik yuz berdi.");
      },
    });
  };

  // Input o'zgarishlarini kuzatish
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

  // Asosiy ma'lumotlarni saqlash
  const handleSaveChanges = () => {
    setErrors({});
    setGeneralError(null);
    setNotification(null);

    const changedData: Partial<PatientProfile> = _.omitBy(
      profile,
      (value, key) => {
        return initialProfileState[key as keyof PatientProfile] === value;
      }
    );

    if (Object.keys(changedData).length > 0) {
      updateProfileMutation.mutate(changedData, {
        onSuccess: (updatedProfile) => {
          const formatted: Partial<PatientProfile> = {
            ...updatedProfile,
            phone: formatPhoneNumber(updatedProfile.phone),
          };
          setProfile(formatted);
          setInitialProfileState(formatted);
          setNotification({
            message: "Ma'lumotlar muvaffaqiyatli saqlandi!",
            type: "success",
          });
        },
        onError: () => {
          // ... (xatoliklarni qayta ishlash logikasi)
        },
      });
    } else {
      setNotification({
        message: "Hech qanday o'zgarish kiritilmadi.",
        type: "info",
      });
    }
  };

  if (isLoading) return <LoadingOverlay />;
  if (isError) return <div>Ma&apos;lumotlarni yuklab bo&apos;lmadi.</div>;



  return (
    <div className="flex h-auto overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1">
          <div className="mx-auto space-y-3">
            <div className="bg-[var(--card-background)] rounded-2xl shadow-lg">
              <div className="p-6 border-b border-[var(--border-color)]">
                <h2 className="text-lg font-bold text-[var(--text-color)]">
                  Profil sozlamalari
                </h2>
                <p className="text-sm text-[var(--text-color)]">
                  Shaxsiy ma&apos;lumotlaringizni yangilang.
                </p>
              </div>
              <div className="p-6 space-y-3">
                {/* --- Avatar Section --- */}
                <div className="flex items-center gap-6">
                  {/* Avatar */}
                  <div className="relative group">
                    {profile?.avatar_url ? (
                      <Image
                        width={100}
                        height={100}
                        className="h-24 w-24 rounded-full object-cover shadow-md"
                        src={profile.avatar_url}
                        alt="Profil rasmi"
                      />
                    ) : (
                      <div className="h-24 w-24 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-2xl shadow-md">
                        {profile?.full_name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div
                      onClick={handleUploadButtonClick}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full cursor-pointer transition"
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* File input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {profile?.avatar_url && !selectedFile && (
                      <button
                        onClick={handleAvatarDelete}
                        disabled={deleteAvatarMutation.isPending}
                        className="text-sm text-red-500 border border-red-500 hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteAvatarMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        O&apos;chirish
                      </button>
                    )}

                    {selectedFile && (
                      <button
                        onClick={handleAvatarUpload}
                        disabled={uploadAvatarMutation.isPending}
                        className="bg-green-600 cursor-pointer text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadAvatarMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Saqlash
                      </button>
                    )}
                  </div>
                </div>

                {errors.avatar && (
                  <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>
                )}

                {/* --- Profile Fields Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {/* Full Name */}
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

                  {/* Email */}
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

                  {/* Phone */}
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

                  {/* Region */}
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
                      value={profile.region || ""}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-[var(--border-color)] bg-[var(--input-bg)] rounded-lg focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                    >
                      <option value="Toshkent shahri">Toshkent shahri</option>
                      <option value="Surxondaryo viloyati">
                        Surxondaryo viloyati
                      </option>
                      {/* Boshqa viloyatlar... */}
                    </select>
                    {errors.region && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.region}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* --- Footer and Save Button --- */}
              <div className="p-6 bg-[var(--card-background)] rounded-b-2xl">
                {generalError && (
                  <p className="text-red-500 text-sm mb-4">{generalError}</p>
                )}
                <div className="flex items-center justify-end gap-4">
                  {notification && (
                    <Notification
                      type={notification.type}
                      message={notification.message}
                    />
                  )}
                  <button
                    onClick={handleSaveChanges}
                    disabled={updateProfileMutation.isPending}
                    className="bg-[#4153F1] text-white cursor-pointer font-bold py-2 px-5 rounded-lg hover:bg-opacity-90 transition disabled:bg-opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]"
                  >
                    {updateProfileMutation.isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {updateProfileMutation.isPending
                      ? "Saqlanmoqda..."
                      : "O'zgarishlarni saqlash"}
                  </button>
                </div>
              </div>
            </div>

            {/* --- Dangerous Zone --- */}
            <div className="bg-[var(--card-background)] rounded-2xl shadow-lg border-2 border-[#EF4444]/20">
              <div className="p-6 border-b border-[var(--border-color)]">
                <h2 className="text-lg font-bold text-[#EF4444]">
                  Xavfli hudud
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <div className="mb-3 sm:mb-0">
                    <h4 className="font-semibold text-[var(--text-color)]">
                      Hisobni o&apos;chirish
                    </h4>
                    <p className="text-sm text-[var(--text-color)]">
                      Hisobingiz o&apos;chirilgach, uni qayta tiklab
                      bo&apos;lmaydi.
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
  );
};

export default Settings;
