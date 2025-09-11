// components/steps/HealthInfoStep.tsx
"use client";

import React, { memo } from "react";
import InputField from "../input-field";
import { FormData, Errors } from "./main-application-modal";

interface HealthInfoStepProps {
  formData: FormData;
  errors: Errors;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => void;
}

const HealthInfoStep = memo<HealthInfoStepProps>(
  ({ formData, errors, handleInputChange }) => (
    <>
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
    </>
  )
);

HealthInfoStep.displayName = "HealthInfoStep";

export default HealthInfoStep;
