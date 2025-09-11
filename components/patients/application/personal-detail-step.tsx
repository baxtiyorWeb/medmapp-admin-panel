// components/steps/PersonalDetailsStep.tsx
"use client";

import React, { memo } from "react";
import InputField from "../input-field"; // InputField komponentingizga yo'lni to'g'rilang
import { FormData, Errors } from "./main-application-modal"; // Tiplarni asosiy komponentdan import qiling

interface PersonalDetailsStepProps {
  formData: FormData;
  errors: Errors;
  phoneInput: string;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const PersonalDetailsStep = memo<PersonalDetailsStepProps>(
  ({ formData, errors, phoneInput, handleInputChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
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
        value={phoneInput}
        required
        onChange={handleInputChange}
        error={errors.phone}
      />
      <InputField
        id="email"
        label="Pochta"
        type="email"
        placeholder="aliyev@gmail.com"
        icon="envelope"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
      />
    </div>
  )
);

PersonalDetailsStep.displayName = "PersonalDetailsStep";

export default PersonalDetailsStep;
