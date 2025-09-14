// components/steps/ReviewStep.tsx
"use client";

import React, { memo } from "react";
import { FormData } from "./main-application-modal";
import { FaPen } from "react-icons/fa";

interface ReviewSectionProps {
  title: string;
  icon: string;
  onEdit: () => void;
  children: React.ReactNode;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  title,
  icon,
  onEdit,
  children,
}) => (
  <div className="mt-6">
    <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)] mb-2">
      <h3 className="text-base font-semibold text-[var(--text-color)] flex items-center gap-3">
        <i className={`bi ${icon} text-primary text-xl`}></i>
        <span>{title}</span>
      </h3>
      <div className="flex space-x-2 text-sm justify-center items-center cursor-pointer">
        <FaPen className="text-primary-600" />
        <button
          type="button"
          className="text-sm cursor-pointer text-primary-600 hover:underline font-semibold"
          onClick={onEdit}
        >
          tahrirlash
        </button>
      </div>
    </div>
    <dl className="grid grid-cols-1 md:gap-x-8">{children}</dl>
  </div>
);

interface ReviewItemProps {
  label: string;
  value?: string | null;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ label, value }) => (
  <div className="py-3 border-b border-[var(--border-color)] grid grid-cols-1 md:grid-cols-3 gap-1">
    <dt className="text-sm font-medium text-[var(--text-color)] md:col-span-1">
      {label}
    </dt>
    <dd className="text-sm text-[var(--secondary-color)] md:col-span-2">
      {value || "Kiritilmagan"}
    </dd>
  </div>
);

interface ReviewStepProps {
  formData: FormData;
  phoneInput: string;
  confirmChecked: boolean;
  onConfirmChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCurrentStep: (step: number) => void;
  submitError?: string | null;
}

const ReviewStep = memo<ReviewStepProps>(
  ({
    formData,
    phoneInput,
    confirmChecked,
    onConfirmChange,
    setCurrentStep,
    submitError,
  }) => (
    <div className="bg-[var(--card-background)]  rounded-xl ">
      <ReviewSection
        title="Shaxsiy ma'lumotlar"
        icon="bi-person-vcard"
        onEdit={() => setCurrentStep(1)}
      >
        <ReviewItem label="Ism-familiya" value={formData.fullName} />
        <ReviewItem label="Tug'ilgan sana" value={formData.dob} />
        <ReviewItem label="Jins" value={formData.gender} />
        <ReviewItem label="Telefon" value={phoneInput} />
        <ReviewItem label="Pochta" value={formData.email} />
      </ReviewSection>

      <ReviewSection
        title="Tibbiy ma'lumotlar"
        icon="bi-clipboard2-pulse"
        onEdit={() => setCurrentStep(2)}
      >
        <ReviewItem label="Shikoyatlar" value={formData.complaint} />
        <ReviewItem label="Avvalgi tashxis" value={formData.diagnosis} />
      </ReviewSection>

      <ReviewSection
        title="Yuklangan hujjatlar"
        icon="bi-file-earmark-text"
        onEdit={() => setCurrentStep(3)}
      >
        <dd className="text-sm text-[var(--secondary-color)] md:col-span-2">
          <ul className="list-disc list-inside">
            {formData.documents.map((doc) => (
              <li key={doc.id}>{doc.name}</li>
            ))}
          </ul>
        </dd>
      </ReviewSection>

      <div className="mt-6 bg-[var(--card-background)] p-4 rounded-xl">
        <label
          htmlFor="confirm-checkbox"
          className="flex items-start cursor-pointer space-x-2"
        >
          <input
            type="checkbox"
            id="confirm-checkbox"
            className="h-5 w-5 cursor-pointer rounded border-slate-400 text-primary-600 focus:ring-primary-500 mt-0.5"
            checked={confirmChecked}
            onChange={onConfirmChange}
          />
          <div className="text-sm text-[var(--text-color)] flex-2">
            Men kiritgan barcha ma&apos;lumotlarning to&apos;g&apos;riligini
            tasdiqlayman hamda
            <a
              target="_blank"
              href="https://medmapp.uz/public-offer"
              className="font-semibold mx-1 underline text-primary-600 hover:underline"
            >
              Ommaviy oferta
            </a>
            va
            <a
              target="_blank"
              href="https://medmapp.uz/privacy-policy"
              className="font-semibold underline mx-1 text-primary-600 hover:underline"
            >
              Maxfiylik siyosati
            </a>
            bilan tanishib chiqdim.
          </div>
        </label>
      </div>

      {submitError && (
        <div className="mt-4 text-red-500 text-sm" role="alert">
          {submitError}
        </div>
      )}
    </div>
  )
);

ReviewStep.displayName = "ReviewStep";

export default ReviewStep;
