// components/InputField.tsx
"use client";

import React, { memo } from "react";

// Komponent qabul qiladigan proplar uchun interfeys (tip)
interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  type?: string;
  placeholder?: string;
  icon?: string;
  required?: boolean;
  selectOptions?: { value: string; label: string }[] | null;
  error?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onFocus?: () => void;
}

// React.memo orqali komponentni optimallashtirish
// Bu faqat proplar o'zgargandagina qayta render bo'lishini ta'minlaydi
const InputField = memo<InputFieldProps>(
  ({
    id,
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    icon,
    required = false,
    selectOptions = null,
    error,
    inputRef,
    onFocus,
  }) => (
    <div>
      <label
        htmlFor={`input-${id}`}
        className="block text-sm font-medium text-[var(--text-color)] mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {/* Agar icon prop berilgan bo'lsa, uni input ichida chap tomonda ko'rsatadi */}
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <i className={`bi bi-${icon}`}></i>
          </span>
        )}

        {/* Agar `selectOptions` prop berilgan bo'lsa, `<select>` elementini render qiladi */}
        {selectOptions ? (
          <>
            <select
              id={`input-${id}`}
              required={required}
              className={`w-full p-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
                icon ? "pl-9" : "pl-3"
              }`}
              value={value}
              onChange={onChange}
            >
              {selectOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 pointer-events-none">
              <i className="bi bi-chevron-down"></i>
            </span>
          </>
        ) : /* Agar `type` "textarea" bo'lsa, `<textarea>` elementini render qiladi */
        type === "textarea" ? (
          <textarea
            id={`input-${id}`}
            rows={5}
            required={required}
            placeholder={placeholder}
            className={`w-full p-2.5 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
              icon ? "pl-9" : "pl-3"
            }`}
            value={value}
            onChange={onChange}
          ></textarea>
        ) : (
          /* Aks holda, standart `<input>` elementini render qiladi */
          <input
            id={`input-${id}`}
            type={type}
            placeholder={placeholder}
            required={required}
            className={`w-full p-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${
              icon ? "pl-9" : "pl-3"
            }`}
            value={value}
            onChange={onChange}
            ref={inputRef}
            onFocus={onFocus}
          />
        )}
      </div>
      {/* Validatsiya xatoliklarini ko'rsatish uchun joy */}
      <div id={`error-${id}`} className="h-5 text-red-500 text-xs mt-1">
        {error}
      </div>
    </div>
  )
);

// React DevTools'da komponent nomini to'g'ri ko'rsatish uchun
InputField.displayName = "InputField";

export default InputField;
