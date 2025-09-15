// components/StatusCard.tsx
"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ChangeEvent,
} from "react";
import { BsCheckCircleFill, BsPencilSquare } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/api";
import { useProfile } from "@/hooks/useProfile";
import { get, isArray } from "lodash";
import "./../application.css";
import ApplicationModal from "./application-modal";
import PersonalDetailsStep from "./personal-detail-step";
import HealthInfoStep from "./health-info-step";
import DocumentUploadStep from "./document-upload-step";
import ReviewStep from "./review-step";
import Modal from "@/exports/modal";

export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

export interface FormData {
  fullName: string;
  dob: string;
  gender: string;
  phone: string; // Backend uchun toza raqam (masalan, 901234567)
  email: string;
  complaint: string;
  diagnosis: string;
  documents: DocumentFile[];
}

export interface Errors {
  [key: string]: string | undefined;
}

const StatusCard: React.FC = () => {
  // State va Hooklar
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(0);
  const [showSuccessNotification, setShowSuccessNotification] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [confirmChecked, setConfirmChecked] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { profile, isLoading } = useProfile();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    complaint: "",
    diagnosis: "",
    documents: [],
  });

  const [phoneInput, setPhoneInput] = useState<string>("");

  useEffect(() => {
    if (profile) {
      const initialPhone = get(profile, "phone")?.replace(/^\+998/, "") || "";
      setFormData((prev) => ({
        ...prev,
        fullName: get(profile, "full_name") || "",
        dob: get(profile, "dob") || "",
        gender: get(profile, "gender") || "",
        phone: initialPhone,
      }));

      if (initialPhone) {
        const limitedPhone = initialPhone.slice(0, 9);
        const formatted = `+998 (${limitedPhone.slice(
          0,
          2
        )}) ${limitedPhone.slice(2, 5)}-${limitedPhone.slice(
          5,
          7
        )}-${limitedPhone.slice(7, 9)}`;
        setPhoneInput(formatted);
      }
    }
  }, [profile]);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setCurrentStep(1);
    setDirection(0);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setFormData((prev) => ({
      ...prev,
      // Asosiy ma'lumotlarni saqlab qolamiz, faqat ariza qismini tozalaymiz
      email: "",
      complaint: "",
      diagnosis: "",
      documents: [],
    }));
    setErrors({});
    setConfirmChecked(false);
    setSubmitError(null);
    setCurrentStep(1);
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {};
    if (step === 1) {
      if (!formData.fullName)
        newErrors.fullName = "Ism-familiya kiritilishi shart";
      if (!formData.dob) newErrors.dob = "Tug'ilgan sana kiritilishi shart";
      if (!formData.gender) newErrors.gender = "Jins tanlanishi shart";
      if (!formData.phone) newErrors.phone = "Telefon raqami kiritilishi shart";
      else if (!/^\d{9}$/.test(formData.phone))
        newErrors.phone = "Telefon raqami to'liq kiritilishi kerak";
    } else if (step === 2) {
      if (!formData.complaint)
        newErrors.complaint = "Shikoyat kiritilishi shart";
    } else if (step === 3) {
      if (formData.documents.length === 0)
        newErrors.documents = "Kamida bitta hujjat yuklash shart";
    } else if (step === 4) {
      if (!confirmChecked) return false;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      setErrors({});
    }
  }, [currentStep, formData]);

  const prevStep = useCallback(() => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  }, []);

  const handleInputChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { id, value } = e.target;
      const field = id.replace("input-", "");

      if (field === "phone") {
        const digits = value.replace(/[^\d]/g, "");
        const cleanPhone = digits.startsWith("998") ? digits.slice(3) : digits;
        const limitedPhone = cleanPhone.slice(0, 9);

        let formatted = "+998";
        if (limitedPhone.length > 0)
          formatted += ` (${limitedPhone.slice(0, 2)}`;
        if (limitedPhone.length > 2)
          formatted += `) ${limitedPhone.slice(2, 5)}`;
        if (limitedPhone.length > 5)
          formatted += `-${limitedPhone.slice(5, 7)}`;
        if (limitedPhone.length > 7)
          formatted += `-${limitedPhone.slice(7, 9)}`;

        setPhoneInput(value === "" ? "" : formatted);
        setFormData((prev) => ({ ...prev, phone: limitedPhone }));
      } else {
        setFormData((prev) => ({ ...prev, [field]: value }));
      }
    },
    []
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const files = Array.from(e.target.files || []);
      const newDocuments = files.map((file) => {
        const id = `file_${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}`;
        return new Promise<DocumentFile>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) =>
            resolve({
              id,
              name: file.name,
              size: file.size,
              type: file.type,
              dataUrl: ev.target?.result as string,
            });
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newDocuments).then((docs) => {
        setFormData((prev) => ({
          ...prev,
          documents: [...prev.documents, ...docs],
        }));
      });
      e.target.value = "";
    },
    []
  );

  const handleReplaceFile = useCallback((id: string): void => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFormData((prev) => ({
            ...prev,
            documents: prev.documents.map((doc) =>
              doc.id === id
                ? {
                    ...doc,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    dataUrl: ev.target?.result as string,
                  }
                : doc
            ),
          }));
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, []);

  const handleDeleteFile = useCallback((id: string): void => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }));
  }, []);

  // Formani serverga yuborish (API integratsiyasi bilan)
  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const normalizePhone = (rawPhone: string): string => {
      if (!rawPhone) return "";
      return `+998${rawPhone.trim()}`;
    };

    try {
      const profilePayload = {
        patient_profile: {
          full_name: formData.fullName,
          dob: formData.dob,
          gender: formData.gender,
          phone: normalizePhone(formData.phone),
          email: formData.email,
        },
      };

      // 1. Profil ma'lumotlarini yangilash
      const profileResponse = await api.patch(
        "/patients/profile/me/",
        profilePayload
      );

      const appPayload = {
        complaint: formData.complaint,
        diagnosis: formData.diagnosis,
        clinic_name: "Medmapp Clinic", // Yoki boshqa manbadan olinadi
      };

      // 2. Yangi ariza yaratish
      const appResponse = await api.post(
        "/applications/application/create/",
        appPayload
      );
      const appId = appResponse.data.id;

      // 3. Hujjatlarni arizaga biriktirib yuklash
      for (const doc of formData.documents) {
        const response = await fetch(doc.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], doc.name, { type: doc.type });

        const docFormData = new FormData();
        docFormData.append("application", appId.toString());
        docFormData.append("file", file);

        await api.post("/applications/documents/create/", docFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Muvaffaqiyatli yakunlash
      if (profileResponse.status === 200 || profileResponse.status === 201) {
        // Original `localStorage` obyektini saqlash
        localStorage.setItem(
          "formData",
          JSON.stringify({
            currentStep: 4,
            formSubmitted: true,
            requestSent: true,
            formData: { ...formData, orderedServices: [] },
            fileToReplaceId: null,
            currentServiceFileField: null,
            hotelFilters: {
              search: "",
              rating: 0,
              priceCategory: "all",
              amenities: [],
            },
          })
        );
        closeModal();
        setShowSuccessNotification(true);
      }
    } catch (error) {
      console.error("API xatosi:", error);
      setSubmitError(
        "So'rov yuborishda xato yuz berdi. Iltimos, qayta urinib ko'ring."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, confirmChecked, closeModal]);

  const steps = useMemo(
    () => [
      {
        icon: "person-vcard",
        title: "Shaxsiy ma'lumotlar",
        description: "Iltimos, barcha maydonlarni to'ldiring.",
      },
      {
        icon: "clipboard2-pulse",
        title: "Sog'lig'ingiz haqida",
        description: "Bu ma'lumotlar bizga yordam berish uchun juda muhim.",
      },
      {
        icon: "file-earmark-arrow-up",
        title: "Tibbiy hujjatlar",
        description: `Shifokorga kasalligingiz haqida to'liq ma'lumot berish uchun mavjud
        tibbiy hujjatlarni (masalan, MRT, tibbiy xulosa va hokazolarni) yuklang.`,
      },
      {
        icon: "check2-all",
        title: "Ma'lumotlarni tekshirish",
        description:
          "Yuborishdan oldin ma'lumotlar to'g'riligiga ishonch hosil qiling.",
      },
    ],
    []
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsStep
            formData={formData}
            errors={errors}
            phoneInput={phoneInput}
            handleInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <HealthInfoStep
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />
        );
      case 3:
        return (
          <DocumentUploadStep
            documents={formData.documents}
            errors={errors}
            onFileUpload={handleFileUpload}
            onReplaceFile={handleReplaceFile}
            onDeleteFile={handleDeleteFile}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            phoneInput={phoneInput}
            confirmChecked={confirmChecked}
            onConfirmChange={(e) => setConfirmChecked(e.target.checked)}
            setCurrentStep={(step) => {
              setDirection(step - currentStep);
              setCurrentStep(step);
            }}
            submitError={submitError}
          />
        );
      default:
        return null;
    }
  };

  const isFormSubmitted =
    typeof window !== "undefined" && localStorage.getItem("formData");

  return (
    <div className="relative">
      {showSuccessNotification && (
        <Modal
          isOpen={showSuccessNotification}
          onClose={() => setShowSuccessNotification(false)}
          title="Muvaffaqiyatli!"
          message="Arizangiz muvaffaqiyatli qabul qilindi. Jarayon yakunlangach shaxsiy kabinetingizga xabar yuboriladi!"
          type="success"
        />
      )}

      {isFormSubmitted ? (
        <div className="bg-gradient-to-r mb-10 from-green-500 to-green-600 text-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                So&apos;rov muvaffaqiyatli yuborildi!
              </h2>
              <p className="text-indigo-200">
                Arizangiz ko&apos;rib chiqilmoqda. Tez orada siz bilan
                bog&apos;lanamiz.
              </p>
            </div>
            <button
              className="bg-white text-green-600 cursor-not-allowed opacity-75 font-bold py-3 px-6 rounded-lg flex items-center space-x-2"
              disabled
            >
              <BsCheckCircleFill />
              <span>Bajarildi</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          id="status-card"
          className="bg-gradient-to-r  from-[#012970] to-[#4154f1] text-white rounded-2xl p-6 md:p-8 shadow-lg mb-10 transition-all duration-500"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2" id="status-text">
                Assalomu alaykum, {get(profile, "full_name") || "Foydalanuvchi"}
                !
              </h2>
              <p className="text-indigo-200 mb-4" id="status-description">
                Tibbiy konsultatsiya olish uchun quyidagi tugmani bosing
              </p>
            </div>
            <button
              id="main-action-button"
              onClick={openModal}
              className="bg-white cursor-pointer text-[#4154f1] hover:bg-primary-50 font-bold py-3 px-6 rounded-lg shadow-md flex items-center space-x-2 flex-shrink-0 transition-all duration-300"
            >
              <BsPencilSquare />
              <span>Anketa to’ldirish</span>
            </button>
          </div>
        </div>
      )}

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        currentStep={currentStep}
        direction={direction}
        onPrev={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSubmitDisabled={!confirmChecked || isSubmitting}
        stepInfo={steps[currentStep - 1]}
      >
        {renderCurrentStep()}
      </ApplicationModal>
    </div>
  );
};

export default StatusCard;
