"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import IMask, { InputMask, MaskedPatternOptions } from "imask";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import api, { setAuthTokens } from "@/utils/api";

// Define interface for API error response
interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export default function Home() {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const loginFormWrapperRef = useRef<HTMLDivElement>(null);
  const registerFormWrapperRef = useRef<HTMLDivElement>(null);
  const tabLoginRef = useRef<HTMLButtonElement>(null);
  const tabRegisterRef = useRef<HTMLButtonElement>(null);
  const loginPhoneMaskRef = useRef<InputMask<MaskedPatternOptions> | null>(
    null
  );
  const registerPhoneMaskRef = useRef<InputMask<MaskedPatternOptions> | null>(
    null
  );
  const loginOtpInputsRef = useRef<HTMLInputElement[]>([]);
  const registerOtpInputsRef = useRef<HTMLInputElement[]>([]);

  const [activeForm, setActiveForm] = useState<"login" | "register">("login");
  const [loginStep, setLoginStep] = useState<"phone" | "otp">("phone");
  const [registerStep, setRegisterStep] = useState<"phone" | "otp">("phone");
  const [timer, setTimer] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginPhone, setLoginPhone] = useState<string>("");
  const [registerPhone, setRegisterPhone] = useState<string>("");
  const [registerFirstName, setRegisterFirstName] = useState<string>("");
  const [registerLastName, setRegisterLastName] = useState<string>("");
  const [registerRegion, setRegisterRegion] = useState<string>("");
  const [loginOtp, setLoginOtp] = useState<string[]>(Array(6).fill(""));
  const [registerOtp, setRegisterOtp] = useState<string[]>(Array(6).fill(""));

  const switchForms = (formToShow: "login" | "register") => {
    setActiveForm(formToShow);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (progressBarRef.current) {
      progressBarRef.current.classList.toggle("visible", loading);
    }
  };

  const startTimer = () => {
    setTimer(60);
    setIsResendDisabled(true);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current as NodeJS.Timeout);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    const icon =
      type === "success" ? "bi-check-circle-fill" : "bi-x-circle-fill";
    toast.innerHTML = `<span class="toast-icon"><i class="bi ${icon}"></i></span><span class="toast-message">${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
    }, 4000);
  };

  const cleanPhoneNumber = (phone: string): string => {
    return phone.replace(/[\s()_-]/g, "");
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    otpState: string[],
    setOtpState: React.Dispatch<React.SetStateAction<string[]>>,
    inputsRef: React.MutableRefObject<HTMLInputElement[]>
  ) => {
    const { value } = e.target;
    if (!/^[0-9]$/.test(value) && value !== "") return;

    const newOtp = [...otpState];
    newOtp[index] = value;
    setOtpState(newOtp);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    otpState: string[],
    setOtpState: React.Dispatch<React.SetStateAction<string[]>>,
    inputsRef: React.MutableRefObject<HTMLInputElement[]>
  ) => {
    if (e.key === "Backspace" && index > 0 && otpState[index] === "") {
      const newOtp = [...otpState];
      newOtp[index - 1] = "";
      setOtpState(newOtp);
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    setOtpState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtpState(newOtp);
      showToast("SMS-kod nusxalandi!", "success");
    } else {
      showToast("Nusxalanadigan kod formati noto'g'ri!", "error");
    }
  };

  const validateRegisterForm = (): boolean => {
    const isFirstNameValid = registerFirstName.trim() !== "";
    const isLastNameValid = registerLastName.trim() !== "";
    const isRegionValid = registerRegion !== "";
    const isPhoneValid =
      registerPhoneMaskRef.current?.masked.isComplete ?? false;
    return isFirstNameValid && isLastNameValid && isRegionValid && isPhoneValid;
  };

  const handleRegisterSendCode = async () => {
    if (!validateRegisterForm()) return;
    setLoading(true);
    const cleanedPhone = cleanPhoneNumber(registerPhone);

    try {
      await api.post("/auth/register/", {
        phone_number: `+998${cleanedPhone}`,
        first_name: registerFirstName,
        last_name: registerLastName,
        district: registerRegion,
      });

      const response = await api.post("/auth/request-otp/", {
        phone_number: `+998${cleanedPhone}`,
      });
      if (response.status === 200) {
        setLoading(false);
        setRegisterStep("otp");
        startTimer();
        showToast("Tasdiqlash kodi yuborildi!", "success");
      }
    } catch (error: unknown) {
      setLoading(false);
      const err = error as ApiError;
      showToast(err.response?.data?.detail || "Xato yuz berdi!", "error");
    }
  };

  const handleLoginSendCode = async () => {
    if (!loginPhoneMaskRef.current?.masked.isComplete) return;
    setLoading(true);
    const cleanedPhone = cleanPhoneNumber(loginPhone);

    try {
      const response = await api.post("/auth/request-otp/", {
        phone_number: `+998${cleanedPhone}`,
      });
      if (response.status === 200) {
        setLoading(false);
        setLoginStep("otp");
        showToast("Tasdiqlash kodi yuborildi!", "success");
      }
    } catch (error: unknown) {
      setLoading(false);
      const err = error as ApiError;
      showToast(err.response?.data?.detail || "Xato yuz berdi!", "error");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const otpCode = loginOtp.join("");
    const cleanedPhone = cleanPhoneNumber(loginPhone);

    try {
      const response = await api.post("/auth/login/", {
        phone_number: `+998${cleanedPhone}`,
        code: otpCode,
      });

      if (response.status === 200) {
        setLoading(false);
        showToast("Tizimga muvaffaqiyatli kirdingiz!", "success");
        setAuthTokens(response.data.access, response.data.refresh);
        // setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error: unknown) {
      setLoading(false);
      const err = error as ApiError;
      showToast(
        err.response?.data?.detail || "Kod noto'g'ri kiritildi!",
        "error"
      );
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const otpCode = registerOtp.join("");
    const cleanedPhone = cleanPhoneNumber(registerPhone);

    try {
      const verifyResponse = await api.post("/auth/verify-otp/", {
        phone_number: `+998${cleanedPhone}`,
        code: otpCode,
      });

      if (verifyResponse.status === 200) {
        setLoading(false);
        showToast("Muvaffaqiyatli ro'yxatdan o'tdingiz!", "success");
        setAuthTokens(verifyResponse.data.access, verifyResponse.data.refresh);
        // setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error: unknown) {
      setLoading(false);
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.detail || "Ro'yxatdan o'tishda xato yuz berdi!";
      showToast(errorMessage, "error");
    }
  };

  useEffect(() => {
    const registerPhoneInput = document.getElementById(
      "registerPhone"
    ) as HTMLInputElement | null;
    const loginPhoneInput = document.getElementById(
      "loginPhone"
    ) as HTMLInputElement | null;

    if (registerPhoneInput) {
      registerPhoneMaskRef.current = IMask(registerPhoneInput, {
        mask: "(00) 000-00-00",
      }).on("accept", () => {
        setRegisterPhone(registerPhoneMaskRef.current?.value || "");
      });
    }

    if (loginPhoneInput) {
      loginPhoneMaskRef.current = IMask(loginPhoneInput, {
        mask: "(00) 000-00-00",
      }).on("accept", () => {
        setLoginPhone(loginPhoneMaskRef.current?.value || "");
      });
    }

    return () => {
      if (registerPhoneMaskRef.current) registerPhoneMaskRef.current.destroy();
      if (loginPhoneMaskRef.current) loginPhoneMaskRef.current.destroy();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        strategy="beforeInteractive"
      />
      <Script src="https://unpkg.com/imask" strategy="beforeInteractive" />

      <div className="auth-wrapper bg-[linear-gradient(to_right,#e9f0f8_0%,#5c99f4_100%)]">
        <div id="toast-container"></div>
        <div className="auth-card">
          <div
            className={`progress-bar-container ${isLoading ? "visible" : ""}`}
            id="progress-bar"
            ref={progressBarRef}
          >
            <div className="progress-bar-line"></div>
          </div>
          <div className="auth-left">
            <div className="icon">
              <Image
                src="/images/MedMapp_Logo_shaffof_new.png"
                width={250}
                height={100}
                style={{ marginBottom: "15px" }}
                alt="MedMapp Logotipi"
              />
            </div>
            <h2>Endi tibbiy sayohat — faqatgina orzu emas!</h2>
            <p>
              Xalqaro miqyosdagi eng yaxshi tibbiy xizmatlar va davolanish
              imkoniyatlaridan mustaqil foydalaning.
            </p>
          </div>

          <div className="auth-right">
            <div className="mobile-logo-container">
              <Image
                src="/images/MedMapp_Logo_shaffof_new.png"
                width={150}
                height={50}
                alt="MedMapp Mobil Logotipi"
              />
            </div>
            <div className="auth-tabs">
              <button
                id="tab-login"
                ref={tabLoginRef}
                className={`auth-tab-btn ${
                  activeForm === "login" ? "active" : ""
                }`}
                type="button"
                onClick={() => switchForms("login")}
              >
                Kirish
              </button>
              <button
                id="tab-register"
                ref={tabRegisterRef}
                className={`auth-tab-btn ${
                  activeForm === "register" ? "active" : ""
                }`}
                type="button"
                onClick={() => switchForms("register")}
              >
                Ro&apos;yxatdan o&apos;tish
              </button>
            </div>

            <div
              id="login-form-wrapper"
              className={`form-wrapper ${
                activeForm === "login" ? "active" : ""
              }`}
              ref={loginFormWrapperRef}
            >
              {loginStep === "phone" && (
                <div id="login-phone-step" className="step">
                  <h3 className="fw-bold mb-2">Tizimga kirish</h3>
                  <p className="text-secondary mb-4">
                    Telefon raqamingizni kiriting.
                  </p>
                  <form onSubmit={(e) => e.preventDefault()}>
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
                        />
                      </div>
                    </div>
                    <div className="d-grid my-3">
                      <button
                        type="button"
                        id="login-send-code-btn"
                        className="btn btn-primary btn-lg"
                        disabled={!loginPhoneMaskRef.current?.masked.isComplete}
                        onClick={handleLoginSendCode}
                      >
                        <span className="btn-text">Davom etish</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {loginStep === "otp" && (
                <div id="login-otp-step" className="step">
                  <h3 className="fw-bold mb-2">Tasdiqlash</h3>
                  <p className="text-secondary mb-3" id="login-otp-message">
                    +998 {loginPhone} raqamiga yuborilgan 6 xonali kodni
                    kiriting.
                  </p>
                  <form id="login-otp-form" onSubmit={handleLoginSubmit}>
                    <div className="otp-input-fields" id="login-otp-container">
                      {loginOtp.map((digit, index) => (
                        <input
                          key={index}
                          type="tel"
                          className="otp-input"
                          maxLength={1}
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(
                              e,
                              index,
                              loginOtp,
                              setLoginOtp,
                              loginOtpInputsRef
                            )
                          }
                          onKeyDown={(e) =>
                            handleOtpKeyDown(
                              e,
                              index,
                              loginOtp,
                              setLoginOtp,
                              loginOtpInputsRef
                            )
                          }
                          onPaste={(e) => handleOtpPaste(e, setLoginOtp)}
                          ref={(el: HTMLInputElement | null) => {
                            if (el) {
                              loginOtpInputsRef.current[index] = el;
                            }
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
                        disabled={loginOtp.join("").length !== 6}
                      >
                        <span className="btn-text">Kirish</span>
                      </button>
                    </div>
                    <p className="text-center small mt-3">
                      <a
                        href="#"
                        className="form-switch-link back-link"
                        id="back-to-login-phone"
                        onClick={(e) => {
                          e.preventDefault();
                          setLoginStep("phone");
                          setLoginOtp(Array(6).fill(""));
                        }}
                      >
                        <i className="bi bi-arrow-left-circle"></i>{" "}
                        <span>Orqaga</span>
                      </a>
                    </p>
                  </form>
                </div>
              )}
            </div>

            <div
              id="register-form-wrapper"
              className={`form-wrapper ${
                activeForm === "register" ? "active" : ""
              }`}
              ref={registerFormWrapperRef}
            >
              {registerStep === "phone" && (
                <div id="register-phone-step" className="step">
                  <h3 className="fw-bold mb-2">Ro&apos;yxatdan o&apos;tish</h3>
                  <p className="text-secondary mb-4">
                    Ma&apos;lumotlarni to&apos;ldiring.
                  </p>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="row">
                      <div className="col-12 col-md-6 mb-3">
                        <label
                          htmlFor="registerFirstName"
                          className="form-label"
                        >
                          Ism
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="registerFirstName"
                          placeholder="Abror"
                          value={registerFirstName}
                          onChange={(e) => setRegisterFirstName(e.target.value)}
                        />
                      </div>
                      <div className="col-12 col-md-6 mb-3">
                        <label
                          htmlFor="registerLastName"
                          className="form-label"
                        >
                          Familiya
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="registerLastName"
                          placeholder="Olimov"
                          value={registerLastName}
                          onChange={(e) => setRegisterLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="registerRegion" className="form-label">
                        Yashash hududingiz
                      </label>
                      <select
                        className="form-select"
                        id="registerRegion"
                        value={registerRegion}
                        onChange={(e) => setRegisterRegion(e.target.value)}
                      >
                        <option value="" disabled>
                          Viloyatni tanlang...
                        </option>
                        <option value="Toshkent shahri">Toshkent shahri</option>
                        <option value="Andijon viloyati">
                          Andijon viloyati
                        </option>
                        <option value="Buxoro viloyati">Buxoro viloyati</option>
                        <option value="Farg'ona viloyati">
                          Farg&apos;ona viloyati
                        </option>
                        <option value="Jizzax viloyati">Jizzax viloyati</option>
                        <option value="Xorazm viloyati">Xorazm viloyati</option>
                        <option value="Namangan viloyati">
                          Namangan viloyati
                        </option>
                        <option value="Navoiy viloyati">Navoiy viloyati</option>
                        <option value="Qashqadaryo viloyati">
                          Qashqadaryo viloyati
                        </option>
                        <option value="Qoraqalpog'iston Respublikasi">
                          Qoraqalpog&apos;iston Respublikasi
                        </option>
                        <option value="Samarqand viloyati">
                          Samarqand viloyati
                        </option>
                        <option value="Sirdaryo viloyati">
                          Sirdaryo viloyati
                        </option>
                        <option value="Surxondaryo viloyati">
                          Surxondaryo viloyati
                        </option>
                        <option value="Toshkent viloyati">
                          Toshkent viloyati
                        </option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="registerPhone" className="form-label">
                        Telefon raqam
                      </label>
                      <div className="phone-input-wrapper">
                        <span className="phone-prefix">+998</span>
                        <input
                          type="tel"
                          className="form-control phone-input"
                          id="registerPhone"
                          placeholder="(90) 123-45-67"
                        />
                      </div>
                    </div>
                    <div className="d-grid my-3">
                      <button
                        type="button"
                        id="register-send-code-btn"
                        className="btn btn-primary btn-lg"
                        disabled={!validateRegisterForm()}
                        onClick={handleRegisterSendCode}
                      >
                        <span className="btn-text">Kod yuborish</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
              {registerStep === "otp" && (
                <div id="register-otp-step" className="step">
                  <h3 className="fw-bold mb-2">Tasdiqlash</h3>
                  <p className="text-secondary mb-3" id="register-otp-message">
                    +998 {registerPhone} raqamiga yuborilgan 6 xonali kodni
                    kiriting.
                  </p>
                  <form id="register-otp-form" onSubmit={handleRegisterSubmit}>
                    <div
                      className="otp-input-fields"
                      id="register-otp-container"
                    >
                      {registerOtp.map((digit, index) => (
                        <input
                          key={index}
                          type="tel"
                          className="otp-input"
                          maxLength={1}
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(
                              e,
                              index,
                              registerOtp,
                              setRegisterOtp,
                              registerOtpInputsRef
                            )
                          }
                          onKeyDown={(e) =>
                            handleOtpKeyDown(
                              e,
                              index,
                              registerOtp,
                              setRegisterOtp,
                              registerOtpInputsRef
                            )
                          }
                          onPaste={(e) => handleOtpPaste(e, setRegisterOtp)}
                          ref={(el: HTMLInputElement | null) => {
                            if (el) {
                              registerOtpInputsRef.current[index] = el;
                            }
                          }}
                        />
                      ))}
                    </div>
                    <div className="validation-message" id="register-otp-error">
                      Kod noto&apos;g&apos;ri kiritildi.
                    </div>
                    <div className="d-grid my-3">
                      <button
                        type="submit"
                        id="register-verify-btn"
                        className="btn btn-primary btn-lg"
                        disabled={registerOtp.join("").length !== 6}
                      >
                        <span className="btn-text">Tasdiqlash</span>
                      </button>
                    </div>
                    <div className="text-center small text-secondary mb-2">
                      Kodning amal qilish muddati: 1 daqiqa
                    </div>
                    <div
                      id="resend-otp-container"
                      className="text-center small"
                    >
                      {isResendDisabled ? (
                        <span id="timer-text">
                          Kod kelmadimi? Qayta yuborish uchun:{" "}
                          <span id="timer">{timer}</span>s
                        </span>
                      ) : (
                        <a
                          href="#"
                          id="resend-otp-link"
                          className="form-switch-link"
                          onClick={(e) => {
                            e.preventDefault();
                            startTimer();
                            handleRegisterSendCode(); // Re-send OTP
                          }}
                        >
                          Qayta yuborish
                        </a>
                      )}
                    </div>
                    <p className="text-center small mt-3">
                      <a
                        href="#"
                        id="back-to-register-phone"
                        className="form-switch-link back-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setRegisterStep("phone");
                          if (timerIntervalRef.current)
                            clearInterval(timerIntervalRef.current);
                        }}
                      >
                        <i className="bi bi-arrow-left-circle"></i>{" "}
                        <span>Orqaga</span>
                      </a>
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
