"use client";

import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast"; // Bu kutubxonani o'rnatish kerak: npm install react-hot-toast

const LoginPage = () => {
  const [isPhoneStep, setIsPhoneStep] = useState(true);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPhone(value);
  };

  const handleSendCode = () => {
    // API chaqiruvi simulyatsiyasi
    if (phone === "901234567") {
      toast.error("Bu raqam ro'yxatdan o'tmagan!");
      return;
    }
    setIsPhoneStep(false);
    toast.success("Tasdiqlash kodi yuborildi.");
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;

    setOtp((prev) => {
      const newOtp = prev.split("");
      newOtp[index] = value;
      return newOtp.join("");
    });

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && index > 0 && !e.currentTarget.value) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "123456") {
      toast.success("Tizimga muvaffaqiyatli kirdingiz!");
    } else {
      toast.error("Kod noto'g'ri kiritildi!");
    }
  };

  useEffect(() => {
    if (!isPhoneStep) {
      otpInputsRef.current[0]?.focus();
    }
  }, [isPhoneStep]);

  return (
    <>
      <div
        id="login-form-wrapper"
        className={`form-wrapper ${isPhoneStep ? "active" : ""}`}
      >
        <div
          id="login-phone-step"
          className={`step ${isPhoneStep ? "" : "hidden"}`}
        >
          <h3 className="font-bold mb-2">Tizimga kirish</h3>
          <p className="text-secondary mb-4">Telefon raqamingizni kiriting.</p>
          <form
            id="login-phone-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCode();
            }}
          >
            <div className="mb-3">
              <label htmlFor="loginPhone" className="form-label">
                Telefon raqam
              </label>
              <div className="phone-input-wrapper">
                <span className="phone-prefix">+998</span>
                <input
                  type="tel"
                  className="form-control phone-input"
                  id="loginPhone"
                  placeholder="(90) 123-45-67"
                  value={phone}
                  onChange={handlePhoneChange}
                  maxLength={9}
                />
              </div>
            </div>
            <div className="d-grid my-3">
              <button
                type="submit"
                id="login-send-code-btn"
                className="btn btn-primary btn-lg"
                disabled={phone.length !== 9}
              >
                <span className="btn-text">Davom etish</span>
              </button>
            </div>
          </form>
        </div>

        <div
          id="login-otp-step"
          className={`step ${isPhoneStep ? "hidden" : ""}`}
        >
          <h3 className="font-bold mb-2">Tasdiqlash</h3>
          <p className="text-secondary mb-3" id="login-otp-message">
            +998{" "}
            {phone.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "($1) $2-$3-$4")}{" "}
            raqamiga yuborilgan 6 xonali kodni kiriting.
          </p>
          <form id="login-otp-form" onSubmit={handleVerify}>
            <div className="otp-input-fields" id="login-otp-container">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="tel"
                  className="otp-input"
                  maxLength={1}
                  inputMode="numeric"
                  value={otp[index] || ""}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  ref={(el) => {
                    otpInputsRef.current[index] = el;
                  }}
                />
              ))}
            </div>
            <div className="validation-message" id="login-otp-error">
              Kod noto&apos;g&apos;ri kiritildi.
            </div>
            <div className="d-grid my-3">
              <button
                type="submit"
                id="login-verify-btn"
                className="btn btn-primary btn-lg"
                disabled={otp.length !== 6}
              >
                <span className="btn-text">Kirish</span>
              </button>
            </div>
            <p className="text-center small mt-3">
              <a
                href="#"
                className="form-switch-link back-link"
                id="back-to-login-phone"
                onClick={() => setIsPhoneStep(true)}
              >
                <i className="bi bi-arrow-left-circle"></i> <span>Orqaga</span>
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
