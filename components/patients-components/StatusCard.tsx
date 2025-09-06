"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  JSX,
  useRef,
  ChangeEvent,
} from "react";
import { BsCheckCircleFill, BsPencilSquare, BsSendCheck } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/api";
import useProfile from "@/hooks/useProfile";
import { isArray } from "lodash";
import { useQuery } from "@tanstack/react-query";
import IMask, { InputMask, MaskedPatternOptions } from "imask";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: string;
  value: string;
  required?: boolean;
  selectOptions?: { value: string; label: string }[] | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  error?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onFocus?: () => void;
}

const InputField = memo<InputFieldProps>(
  ({
    id,
    label,
    type = "text",
    placeholder,
    icon,
    value,
    required = false,
    selectOptions = null,
    onChange,
    error,
    inputRef,
    onFocus,
  }) => (
    <div>
      <label
        htmlFor={`input-${id}`}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <i className={`bi bi-${icon}`}></i>
        </span>
        {selectOptions ? (
          <>
            <select
              id={`input-${id}`}
              required={required}
              className="pl-10 w-full p-2.5 bg-slate-100 dark:bg-slate-700/50 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none transition"
              value={value}
              onChange={onChange}
            >
              {selectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
              <i className="bi bi-chevron-down"></i>
            </span>
          </>
        ) : type === "textarea" ? (
          <textarea
            id={`input-${id}`}
            rows={5}
            required={required}
            placeholder={placeholder}
            className="pl-10 w-full p-3 bg-slate-100 dark:bg-slate-700/50 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            value={value}
            onChange={onChange}
          ></textarea>
        ) : (
          <input
            id={`input-${id}`}
            type={type}
            placeholder={placeholder}
            required={required}
            className="pl-10 w-full p-2.5 bg-slate-100 dark:bg-slate-700/50 dark:text-white border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            value={value}
            onChange={onChange}
            ref={inputRef}
            onFocus={onFocus}
          />
        )}
      </div>
      <div id={`error-${id}`} className="h-5 text-red-500 text-xs mt-1">
        {error}
      </div>
    </div>
  )
);

InputField.displayName = "InputField";

interface FormData {
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  complaint: string;
  diagnosis: string;
  documents: DocumentFile[];
}

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

interface Errors {
  [key: string]: string | undefined;
}

const StatusCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(0);
  const [showSuccessNotification, setShowSuccessNotification] =
    useState<boolean>(false);
  const { fetchProfile } = useProfile();
  const loginPhoneMaskRef = useRef<InputMask<MaskedPatternOptions> | null>(
    null
  );
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => await fetchProfile(),
    staleTime: 5 * 60 * 1000,
  });

  const isData = isArray(data) ? data : [data];
  const dataItem = isData && isData.length > 0 ? isData[0] : null;

  const [phoneInput, setPhoneInput] = useState<string>(`${dataItem.phone}`);
  const [formData, setFormData] = useState<FormData>({
    fullName: `${dataItem?.full_name || ""}`,
    dob: `${dataItem?.dob || ""}`,
    gender: `${dataItem?.gender || ""}`,
    phone: `${dataItem?.phone?.replace(/^\+998/, "") || ""}`, // Strip +998 if present
    email: "",
    complaint: "",
    diagnosis: "",
    documents: [],
  });
  const [errors, setErrors] = useState<Errors>({});
  const [confirmChecked, setConfirmChecked] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  useEffect(() => {
    if (!dataItem.phone) return;

    const phoneNumber = dataItem.phone.replace(/[^\d]/g, "");
    const cleanPhone = phoneNumber.startsWith("998")
      ? phoneNumber.slice(3)
      : phoneNumber;
    const limitedPhone = cleanPhone.slice(0, 9);

    let formatted = "";
    if (limitedPhone.length <= 2) {
      formatted = `+998 (${limitedPhone}`;
    } else if (limitedPhone.length <= 5) {
      formatted = `+998 (${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(2)}`;
    } else if (limitedPhone.length <= 7) {
      formatted = `+998 (${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(
        2,
        5
      )}-${limitedPhone.slice(5)}`;
    } else {
      formatted = `+998 (${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(
        2,
        5
      )}-${limitedPhone.slice(5, 7)}-${limitedPhone.slice(7, 9)}`;
    }

    setFormData((prev) => ({ ...prev, phone: limitedPhone }));
    setPhoneInput(formatted);
  }, [dataItem.phone]);
  const openModal = (): void => {
    setIsModalOpen(true);
    setCurrentStep(1);
    setDirection(0);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setCurrentStep(1);
    setFormData((prev) => ({ ...prev, documents: [], phone: "" }));
    setErrors({});
    setConfirmChecked(false);
    setSubmitError(null);
  };

  // Validate phone number
  const validateStep = (step: number): boolean => {
    const newErrors: Errors = {};

    if (step === 1) {
      if (!formData.fullName)
        newErrors.fullName = "Ism-familiya kiritilishi shart";
      if (!formData.dob) newErrors.dob = "Tug'ilgan sana kiritilishi shart";
      if (!formData.gender) newErrors.gender = "Jins tanlanishi shart";
      if (!formData.phone) newErrors.phone = "Telefon raqami kiritilishi shart";
      if (!formData.phone) newErrors.phone = "Telefon raqami kiritilishi shart";
      else if (!/^\d{9}$/.test(formData.phone))
        newErrors.phone =
          "Telefon raqami +998 (90) 123-45-67 formatida bo'lishi kerak";
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

  const nextStep = (): void => {
    if (validateStep(currentStep)) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      setErrors({});
    }
  };

  const prevStep = (): void => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleInputChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { id, value } = e.target;
      const field = id.replace("input-", "");

      if (field === "phone") {
        // Telefon uchun maxsus formatlash
        const phoneNumber = value.replace(/[^\d]/g, "");
        const cleanPhone = phoneNumber.startsWith("998")
          ? phoneNumber.slice(3)
          : phoneNumber;
        const limitedPhone = cleanPhone.slice(0, 9);

        if (value === "") {
          setFormData((prev) => ({ ...prev, phone: "" }));
          setPhoneInput("");
          return;
        }

        // Formatlash
        let formatted = "";
        if (limitedPhone.length <= 2) {
          formatted = `+998 (${limitedPhone}`;
        } else if (limitedPhone.length <= 5) {
          formatted = `+998 (${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(
            2
          )}`;
        } else if (limitedPhone.length <= 7) {
          formatted = `+998 (${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(
            2,
            5
          )}-${limitedPhone.slice(5)}`;
        } else {
          formatted = `+998 (${limitedPhone.slice(0, 2)}) ${limitedPhone.slice(
            2,
            5
          )}-${limitedPhone.slice(5, 7)}-${limitedPhone.slice(7, 9)}`;
        }

        setFormData((prev) => ({ ...prev, phone: limitedPhone })); // Backend uchun raw
        setPhoneInput(formatted); // UI uchun formatted
      } else {
        // Boshqa maydonlar
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
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

  const handleSubmit = async (): Promise<void> => {
    if (validateStep(4)) {
      setIsSubmitting(true);
      setSubmitError(null);

      const normalizePhone = (rawPhone?: string | null): string | null => {
        if (!rawPhone) return null; // Agar bo'sh bo'lsa
        const phone = rawPhone.trim();

        // 1. Agar allaqachon +998 bilan boshlangan bo‘lsa
        if (phone.startsWith("+998")) {
          return phone;
        }

        // 2. Agar 998 bilan boshlangan bo‘lsa (lekin + yo‘q)
        if (phone.startsWith("998")) {
          return `+${phone}`;
        }

        // 3. Agar faqat raqamlar kiritilgan bo‘lsa (masalan 90 123 45 67)
        //    => boshiga +998 qo‘shamiz
        return `+998${phone}`;
      };

      try {
        const profilePayload = {
          patient_profile: {
            full_name: formData.fullName,
            dob: formData.dob,
            gender: formData.gender,
            phone: normalizePhone(phoneInput || formData.phone), // normalize qilingan raqam
            email: formData.email,
          },
          complaint: formData.complaint,
          diagnosis: formData.diagnosis,
        };

        const profileResponse = await api.patch(
          "/patients/profile/me/",
          profilePayload
        );

        const appPayload = {
          complaint: formData.complaint,
          diagnosis: formData.diagnosis,
          clinic_name: "clinick name",
        };

        const appResponse = await api.post(
          "/applications/application/create/",
          appPayload
        );

        const appId = appResponse.data.id;

        for (const doc of formData.documents) {
          const response = await fetch(doc.dataUrl);
          const blob = await response.blob();
          const file = new File([blob], doc.name, { type: doc.type });

          const docFormData = new FormData();
          docFormData.append("application", appId.toString());
          docFormData.append("file", file);

          await api.post("/applications/documents/create/", docFormData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        }

        if (profileResponse.status === 200 || profileResponse.status === 201) {
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
    }
  };

  useEffect(() => {
    const totalSteps = 4;
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

    const modalProgressBar = document.getElementById("modal-progress-bar");
    const statusProgressBar = document.getElementById("progress-bar");

    if (modalProgressBar) modalProgressBar.style.width = `${progress}%`;
    if (statusProgressBar) statusProgressBar.style.width = `${progress}%`;
  }, [currentStep]);

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  interface Step {
    icon: string;
    title: string;
    description: string;
    content: JSX.Element;
  }

  const stepCallback = useCallback(() => {
    if (typeof window === "undefined") return 0;

    let formDatas: { currentStep?: number } = {};
    try {
      const storedData = localStorage.getItem("formData");
      if (storedData) {
        formDatas = JSON.parse(storedData);
      }
    } catch (e) {
      console.error("JSON parse xato:", e);
    }

    const currentStepValue = formDatas.currentStep || 1;
    const totalSteps = 4;

    return ((currentStepValue - 1) / (totalSteps - 1)) * 100;
  }, []);

  useEffect(() => {
    const callPercent = stepCallback();
    setPercent(callPercent);
  }, [stepCallback]);

  const renderStep = (): JSX.Element => {
    const steps: Step[] = [
      {
        icon: "person-vcard",
        title: "Shaxsiy Ma'lumotlar",
        description: "Iltimos, barcha maydonlarni to'ldiring.",
        content: (
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <InputField
                  id="fullName"
                  label="Ism-familiya"
                  placeholder="Valiyev Ali G'aniyevich"
                  icon="person"
                  value={formData.fullName}
                  required
                  onChange={handleInputChange}
                  error={errors.fullName}
                />
                <InputField
                  id="dob"
                  label="Tug'ilgan sana"
                  type="date"
                  icon="calendar-event"
                  value={formData.dob}
                  required
                  onChange={handleInputChange}
                  error={errors.dob}
                />
                <InputField
                  id="gender"
                  label="Jins"
                  icon="gender-ambiguous"
                  value={formData.gender}
                  required
                  selectOptions={[
                    { value: "", label: "Tanlang..." },
                    { value: "male", label: "Erkak" },
                    { value: "female", label: "Ayol" },
                  ]}
                  onChange={handleInputChange}
                  error={errors.gender}
                />
                <InputField
                  id="phone"
                  label="Telefon"
                  placeholder="+998 (##) ###-##-##"
                  icon="phone"
                  value={phoneInput} // <- controlled input, state bilan bog‘lanadi
                  required
                  onChange={handleInputChange}
                  inputRef={phoneInputRef}
                  error={errors.phone}
                />
                <InputField
                  id="email"
                  label="Pochta"
                  type="email"
                  placeholder="aliyev@gmail.com"
                  icon="envelope"
                  value={formData.email}
                  required={false}
                  onChange={handleInputChange}
                  error={errors.email}
                />
              </div>
            </div>
          </div>
        ),
      },
      {
        icon: "clipboard2-pulse",
        title: "Sog'lig'ingiz haqida",
        description: "Bizga yordam berish uchun bu ma'lumotlar juda muhim.",
        content: (
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl space-y-4 shadow-sm">
              <InputField
                id="complaint"
                label="Sizni nima bezovta qilmoqda?"
                type="textarea"
                placeholder="Yurak sohasidagi og'riq, nafas qisishi, tez charchash..."
                value={formData.complaint}
                required
                onChange={handleInputChange}
                error={errors.complaint}
              />
              <InputField
                id="diagnosis"
                label="Avvalgi tashxislar (mavjud bo'lsa)"
                placeholder="Tashxislarni vergul bilan ajratib kiriting"
                value={formData.diagnosis}
                onChange={handleInputChange}
                error={errors.diagnosis}
              />
            </div>
          </div>
        ),
      },
      {
        icon: "file-earmark-arrow-up",
        title: "Tibbiy Hujjatlar",
        description:
          "Shifokorga kasalligingiz haqida to'liq ma'lumot berish uchun kamida bitta tibbiy hujjat (masalan, MRT, tibbiy xulosa va hokazolarni) yuklang.",
        content: (
          <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-sm">
              <label
                htmlFor="file-upload-input-multiple"
                className="relative block w-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-slate-50 dark:bg-slate-700/50"
              >
                <i className="bi bi-cloud-arrow-up-fill text-5xl text-primary-500"></i>
                <p className="mt-3 text-lg font-semibold text-slate-700 dark:text-slate-300">
                  Fayl yuklash
                </p>
                <p className="text-sm text-slate-500">
                  yoki fayllarni shu yerga tashlang (kamida bitta fayl yuklash
                  shart)
                </p>
              </label>
              <input
                id="file-upload-input-multiple"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileUpload}
              />
              <input
                id="file-upload-input-single"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
              />
              <div id="file-list-container" className="mt-6 space-y-4">
                {formData.documents.length === 0 ? (
                  <div className="text-center py-8 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <i className="bi bi-folder2-open text-4xl text-slate-400"></i>
                    <p className="mt-2 text-slate-500">
                      Hozircha hujjatlar yuklanmagan.
                    </p>
                  </div>
                ) : (
                  formData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center gap-4 shadow-sm"
                    >
                      <div className="file-card-preview">
                        <img
                          src={doc.dataUrl}
                          alt={doc.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p
                          className="font-semibold text-slate-800 dark:text-slate-200 truncate"
                          title={doc.name}
                        >
                          {doc.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {(doc.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                          onClick={() => handleReplaceFile(doc.id)}
                          title="Almashtirish"
                        >
                          <i className="bi bi-arrow-repeat text-slate-600 dark:text-slate-300"></i>
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                          onClick={() => handleDeleteFile(doc.id)}
                          title="O'chirish"
                        >
                          <i className="bi bi-trash3-fill text-slate-600 dark:text-slate-300"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
                {errors.documents && (
                  <div className="text-red-500 text-sm mt-2">
                    {errors.documents}
                  </div>
                )}
              </div>
            </div>
          </div>
        ),
      },
      {
        icon: "check2-all",
        title: "Ma'lumotlarni tekshirish",
        description:
          "Yuborishdan oldin barcha ma'lumotlar to'g'riligiga ishonch hosil qiling.",
        content: (
          <div id="review-container" className="w-full max-w-3xl mx-auto">
            <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl p-6">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700 mb-2">
                <h3 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-3">
                  <i className="bi bi-person-vcard text-primary text-xl"></i>
                  <span>Shaxsiy ma&apos;lumotlar</span>
                </h3>
                <button
                  type="button"
                  className="edit-btn text-sm text-primary-600 hover:underline font-semibold"
                  onClick={() => {
                    setDirection(-1);
                    setCurrentStep(1);
                  }}
                >
                  Tahrirlash
                </button>
              </div>
              <dl className="divide-y divide-slate-100 dark:divide-slate-700/50 grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
                {[
                  { label: "Ism-familiya", value: formData.fullName },
                  { label: "Tug'ilgan sana", value: formData.dob },
                  { label: "Jins", value: formData.gender },
                  {
                    label: "Telefon",
                    value: formData.phone,
                  }, // Display formatted phone
                  { label: "Pochta", value: formData.email || "Kiritilmagan" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3 grid grid-cols-1 md:grid-cols-3 gap-1"
                  >
                    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 md:col-span-1">
                      {item.label}
                    </dt>
                    <dd className="text-sm text-slate-900 dark:text-slate-100 md:col-span-2">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700 mt-6 mb-2">
                <h3 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-3">
                  <i className="bi bi-clipboard2-pulse text-red-500 text-xl"></i>
                  <span>Tibbiy ma&apos;lumotlar</span>
                </h3>
                <button
                  type="button"
                  className="edit-btn text-sm text-primary-600 hover:underline font-semibold"
                  onClick={() => {
                    setDirection(-1);
                    setCurrentStep(2);
                  }}
                >
                  Tahrirlash
                </button>
              </div>
              <dl className="divide-y divide-slate-100 dark:divide-slate-700/50">
                <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-1 md:col-span-2">
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 md:col-span-1">
                    Shikoyatlar
                  </dt>
                  <dd className="text-sm text-slate-900 dark:text-slate-100 md:col-span-2">
                    <p className="whitespace-pre-wrap">{formData.complaint}</p>
                  </dd>
                </div>
                <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-1 md:col-span-2">
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 md:col-span-1">
                    Avvalgi tashxis
                  </dt>
                  <dd className="text-sm text-slate-900 dark:text-slate-100 md:col-span-2">
                    {formData.diagnosis || "Kiritilmagan"}
                  </dd>
                </div>
              </dl>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700 mt-6 mb-2">
                <h3 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-3">
                  <i className="bi bi-file-earmark-text text-primary text-xl"></i>
                  <span>Yuklangan hujjatlar</span>
                </h3>
                <button
                  type="button"
                  className="edit-btn text-sm text-primary-600 hover:underline font-semibold"
                  onClick={() => {
                    setDirection(-1);
                    setCurrentStep(3);
                  }}
                >
                  Tahrirlash
                </button>
              </div>
              <dl className="divide-y divide-slate-100 dark:divide-slate-700/50">
                <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-1 md:col-span-2">
                  <dt className="text-sm font-medium text-slate-500 dark:text-slate-400 md:col-span-1">
                    Fayllar
                  </dt>
                  <dd className="text-sm text-slate-900 dark:text-slate-100 md:col-span-2">
                    <ul className="list-disc list-inside">
                      {formData.documents.map((doc) => (
                        <li key={doc.id}>{doc.name}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="mt-6 bg-slate-100 dark:bg-slate-800 p-4 rounded-xl">
              <label
                htmlFor="confirm-checkbox"
                className="flex items-start space-x-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="confirm-checkbox"
                  className="h-5 w-5 rounded border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-700 text-primary-600 focus:ring-primary-500 mt-0.5 flex-shrink-0"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Men kiritgan barcha ma&apos;lumotlarning
                  to&apos;g&apos;riligini tasdiqlayman hamda{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Ommaviy oferta matni shu yerda ko'rsatiladi.");
                    }}
                    className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Ommaviy oferta
                  </a>{" "}
                  va{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(
                        "Foydalanish shartlari matni shu yerda ko'rsatiladi."
                      );
                    }}
                    className="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Foydalanish shartlari
                  </a>{" "}
                  bilan tanishib chiqdim.
                </span>
              </label>
            </div>
            {submitError && (
              <div className="mt-4 text-red-500 text-sm">{submitError}</div>
            )}
          </div>
        ),
      },
    ];

    return (
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="form-step active"
          data-step={currentStep}
        >
          <div className="w-full max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                <i
                  className={`bi bi-${steps[currentStep - 1].icon} text-4xl ${
                    currentStep === 2
                      ? "text-red-500"
                      : currentStep === 4
                      ? "text-teal-500"
                      : "text-primary-500"
                  }`}
                ></i>
              </div>
              <h4 className="text-xl font-semibold mt-4 text-slate-800 dark:text-slate-200">
                {steps[currentStep - 1].title}
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {steps[currentStep - 1].description}
              </p>
            </div>
            {steps[currentStep - 1].content}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="relative">
      {showSuccessNotification && (
        <div className="notification success flex items-center gap-2 p-4 mb-4 rounded-lg">
          Arizangiz muvaffaqiyatli qabul qilindi. Jarayon yakunlangach tez orada
          shaxsiy kabinetingizga xabar yuboriladi!
          <i className="bi bi-check-circle text-success"></i>
        </div>
      )}
      {typeof window !== "undefined" &&
      window.localStorage.getItem("formData") ? (
        <div
          id="status-card"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 md:p-8 shadow-lg mb-8 transition-all duration-500"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2" id="status-text">
                So&apos;rov muvaffaqiyatli yuborildi!
              </h2>
              <p className="text-indigo-200 mb-4" id="status-description">
                Arizangiz ko&apos;rib chiqilmoqda. Tez orada operatorlarimiz siz
                bilan bog&apos;lanadi.
              </p>
              <div className="w-full bg-green-400/50 rounded-full h-2.5">
                <div
                  id="progress-bar"
                  className="bg-white rounded-full h-2.5 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
            <button
              id="main-action-button"
              className="bg-white text-green-600 cursor-not-allowed opacity-75 font-bold py-3 px-6 rounded-lg shadow-md flex items-center space-x-2 flex-shrink-0 transition-all duration-300"
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
          className="bg-gradient-to-r from-[#012970] to-[#4154f1] text-white rounded-2xl p-6 md:p-8 shadow-lg mb-8 transition-all duration-500"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2" id="status-text">
                Assalomu alaykum, {dataItem?.full_name || "Foydalanuvchi"}!
              </h2>
              <p className="text-indigo-200 mb-4" id="status-description">
                Tibbiy konsultatsiya uchun so&apos;rov yuborishni boshlash uchun
                quyidagi tugmani bosing.
              </p>
              <div className="w-full bg-[rgb(129_140_248_/_50%)] rounded-full h-2.5">
                <div
                  id="progress-bar"
                  style={{ width: `${percent}%` }}
                  className="bg-[#4f45e4] rounded-full h-2.5 transition-all duration-300"
                ></div>
              </div>
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

      {(isModalOpen || isClosing) && (
        <div
          onClick={handleClose}
          className={`fixed z-50 inset-0 flex items-center justify-center bg-black/80 transition-opacity duration-100 ${
            isClosing ? "opacity-0" : "visible"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`z-[200] bg-slate-50 dark:bg-slate-900/80 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col transform transition-transform duration-300 ${
              isClosing ? "scale-95" : "scale-100"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                Tibbiy konsultatsiya uchun anketa
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <i className="bi bi-x-lg text-2xl"></i>
              </button>
            </div>
            <div className="px-6 pt-5">
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div
                  id="modal-progress-bar"
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                ></div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">{renderStep()}</div>
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-2xl">
              <button
                type="button"
                id="prev-btn"
                className={`bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition ${
                  currentStep === 1 ? "invisible" : ""
                }`}
                onClick={prevStep}
              >
                Orqaga
              </button>
              <div className="flex-grow"></div>
              {currentStep < 4 ? (
                <button
                  type="button"
                  id="next-btn"
                  className="bg-[#4f45e4] text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
                  onClick={nextStep}
                >
                  Keyingisi <i className="bi bi-arrow-right"></i>
                </button>
              ) : (
                <button
                  type="button"
                  id="submit-btn"
                  className="disabled:bg-[#96cab3] bg-[#069668] text-white font-bold py-3 px-6 rounded-lg hover:bg-success-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!confirmChecked || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Tasdiqlash va Yuborish"}{" "}
                  <BsSendCheck />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
