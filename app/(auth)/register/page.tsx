"use client";

import React, { useState } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    region: "",
    phone: "",
  });
  const [isPhoneStep, setIsPhoneStep] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSendCode = () => {
    // APIga ro'yxatdan o'tish ma'lumotlarini yuborish logikasi
    setIsPhoneStep(false);
  };

  return (
    <div>
      <h3 className="mb-2 text-2xl font-bold">Ro‘yxatdan o‘tish</h3>
      <p className="mb-4 text-sm text-gray-500">
        Ma&apos;lumotlarni to‘ldiring.
      </p>
      {isPhoneStep ? (
        <form>
          <div className="mb-3 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <div className="flex-1">
              <label htmlFor="firstName" className="mb-1 block font-semibold">
                Ism
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full rounded-xl border border-border-color bg-gray-50 p-3"
                placeholder="Abror"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="mb-1 block font-semibold">
                Familiya
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full rounded-xl border border-border-color bg-gray-50 p-3"
                placeholder="Olimov"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="region" className="mb-1 block font-semibold">
              Yashash hududingiz
            </label>
            <select
              id="region"
              className="w-full rounded-xl border border-border-color bg-gray-50 p-3"
              value={formData.region}
              onChange={handleChange}
            >
              <option value="" disabled>
                Viloyatni tanlang...
              </option>
              <option value="Toshkent shahri">Toshkent shahri</option>
              {/* Boshqa viloyatlar... */}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="mb-1 block font-semibold">
              Telefon raqam
            </label>
            <div className="flex items-center rounded-xl border border-border-color bg-gray-50 p-2 focus-within:ring-2 focus-within:ring-primary">
              <span className="pl-2 font-medium">+998</span>
              <input
                type="tel"
                id="phone"
                className="w-full border-none bg-transparent p-2 focus:outline-none"
                placeholder="(90) 123-45-67"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="my-3 grid">
            <button
              type="button"
              onClick={handleSendCode}
              disabled={Object.values(formData).some((v) => v === "")}
              className="btn btn-primary rounded-xl bg-primary px-4 py-3 text-white transition-all hover:bg-primary-dark disabled:bg-primary/50"
            >
              Kod yuborish
            </button>
          </div>
        </form>
      ) : (
        // OTP tasdiqlash bosqichi
        // Bu joyga kirish sahifasidagidek OTP formasi qo'yiladi
        <p>
          OTP formasi... <br />
          <button
            onClick={() => setIsPhoneStep(true)}
            className="mt-3 font-semibold text-primary hover:underline"
          >
            Orqaga
          </button>
        </p>
      )}
    </div>
  );
};

export default RegisterPage;
