"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import IMask, { InputMask, MaskedPatternOptions } from "imask";
import Script from "next/script";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import api, { setAuthTokens } from "@/utils/api";
import { AiOutlineLoading } from "react-icons/ai";
import { useRouter } from "next/navigation";

// API xatolik javobi uchun interfeys
interface ApiError {
  response?: {
    data?: {
      phone_number?: string;
      detail?: string;
    };
    status?: number;
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
  const [otpError, setOtpError] = useState<boolean>(false);
  const [otpSubmitted, setOtpSubmitted] = useState(false);

  const switchForms = (formToShow: "login" | "register") => {
    setActiveForm(formToShow);
    setLoginStep("phone");
    setRegisterStep("phone");
    setLoginPhone("");
    setLoginOtp(Array(6).fill(""));
    setRegisterOtp(Array(6).fill(""));
    setOtpError(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
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

    if (newOtp.join("").length === 6) {
      setOtpError(false);
      const completeOtp = newOtp.join("");
      const mockEvent = {
        preventDefault: () => {},
      } as React.FormEvent<HTMLFormElement>;

      if (activeForm === "login") {
        handleLoginSubmit(mockEvent, completeOtp);
      } else {
        handleRegisterSubmit(mockEvent, completeOtp);
      }
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    otpState: string[],
    setOtpState: React.Dispatch<React.SetStateAction<string[]>>,
    inputsRef: React.MutableRefObject<HTMLInputElement[]>
  ) => {
    if (e.key === "Backspace" && index > 0 && !otpState[index]) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    setOtpState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    e.preventDefault();
    let pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    pastedData = pastedData.replace(/\D/g, "");

    if (pastedData.length > 0) {
      const newOtp = Array(6).fill("");
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtpState(newOtp);
      showToast("SMS-kod nusxalandi!", "success");
      setOtpError(false);

      if (pastedData.length === 6) {
        const mockEvent = {
          preventDefault: () => {},
        } as React.FormEvent<HTMLFormElement>;
        if (activeForm === "login") {
          handleLoginSubmit(mockEvent, pastedData);
        } else {
          handleRegisterSubmit(mockEvent, pastedData);
        }
      }
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
      await api.post("/auth/auth/register/", {
        phone_number: `+998${cleanedPhone}`,
        first_name: registerFirstName,
        last_name: registerLastName,
        district: registerRegion,
      });

      const response = await api.post("/auth/auth/request-otp/", {
        phone_number: `+998${cleanedPhone}`,
      });
      if (response.status === 200) {
        setLoading(false);
        setRegisterStep("otp");
        startTimer();
        showToast("Tasdiqlash kodi yuborildi!", "success");

        // >>> BU YERGA YANGI KOD QO'SHILDI >>>
        // Agar API javobida OTP kodi kelsa (test uchun), uni avtomatik to'ldirish
        if (response.data && response.data.otp) {
          const otpCode = response.data.otp.toString();
          if (otpCode.length === 6) {
            const otpArray = otpCode.split(''); // "678354" -> ['6','7','8','3','5','4']
            setRegisterOtp(otpArray);
            showToast("Kod avtomatik to'ldirildi!", "success");
          }
        }
        // <<< O'ZGARTIRISH TUGADI <<<
      }
    } catch (error: unknown) {
      setLoading(false);
      const err = error as ApiError;
      showToast(err.response?.data?.phone_number || "Xato yuz berdi!", "error");
    }
  };

  const handleLoginSendCode = async () => {
    if (!loginPhoneMaskRef.current?.masked.isComplete) return;
    setLoading(true);
    const cleanedPhone = cleanPhoneNumber(loginPhone);

    try {
      const response = await api.post("/auth/auth/request-otp/", {
        phone_number: `+998${cleanedPhone}`,
      });
      if (response.status === 200) {
        setLoading(false);
        setLoginStep("otp");
        showToast("Tasdiqlash kodi yuborildi!", "success");
        startTimer();

        // >>> BU YERGA YANGI KOD QO'SHILDI >>>
        // Agar API javobida OTP kodi kelsa (test uchun), uni avtomatik to'ldirish
        if (response.data && response.data.otp) {
          const otpCode = response.data.otp.toString();
          if (otpCode.length === 6) {
            const otpArray = otpCode.split(''); // "678354" -> ['6','7','8','3','5','4']
            setLoginOtp(otpArray);
            showToast("Kod avtomatik to'ldirildi!", "success");
          }
        }
        // <<< O'ZGARTIRISH TUGADI <<<
      }
    } catch (error: unknown) {
      setLoading(false);
      const err = error as ApiError;
      showToast(err.response?.data?.phone_number || "Xato yuz berdi!", "error");
    }
  };

  const handleLoginSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    otpCode: string
  ) => {
    e.preventDefault();
    if (isLoading) return;
    setLoading(true);
    setOtpError(false);
    const cleanedPhone = cleanPhoneNumber(loginPhone);

    if (otpCode.length !== 6) {
      setLoading(false);
      setOtpError(true);
      return;
    }

    try {
      const response = await api.post("/auth/auth/login/", {
        phone_number: `+998${cleanedPhone}`,
        code: otpCode,
      });

      if (response.status === 200) {
        setOtpError(false);
        setLoading(false);
        showToast("Tizimga muvaffaqiyatli kirdingiz!", "success");
        setAuthTokens(response.data.access, response.data.refresh);
        setTimeout(() => (window.location.href = "/patients-panel"), 800);
      }
    } catch (error: unknown) {
      setLoading(false);
      const err = error as ApiError;
      setOtpError(true);
      showToast(
        err.response?.data?.detail || "Kod noto'g'ri kiritildi!",
        "error"
      );
    }
  };

  const handleRegisterSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    otpCode: string
  ) => {
    e.preventDefault();
    if (isLoading) return;
    setLoading(true);
    setOtpError(false);
    const cleanedPhone = cleanPhoneNumber(registerPhone);

    if (otpCode.length !== 6) {
      setLoading(false);
      setOtpError(true);
      showToast("6 xonali kodni kiriting!", "error");
      return;
    }

    try {
      const verifyResponse = await api.post("/auth/auth/verify-otp/", {
        phone_number: `+998${cleanedPhone}`,
        code: otpCode,
      });

      if (verifyResponse.status === 200) {
        setOtpError(false);
        setLoading(false);
        showToast("Muvaffaqiyatli ro'yxatdan o'tdingiz!", "success");
        setAuthTokens(verifyResponse.data.access, verifyResponse.data.refresh);
        setTimeout(() => (window.location.href = "/patients-panel"), 800);
      }
    } catch (error: unknown) {
      setLoading(false);
      const err = error as ApiError;
      setOtpError(true);
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
      registerPhoneMaskRef.current?.destroy();
      loginPhoneMaskRef.current?.destroy();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [activeForm]); // activeForm o'zgarganda maskalarni qayta ishga tushirish uchun qo'shildi

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
            ref={progressBarRef}
          >
            <div className="progress-bar-line"></div>
          </div>
          <div className="auth-left">
            <div className="icon relative left-14 -top-20">
              <Image
                src={"/assets/login.png"}
                width={300}
                height={120}
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
                src={"/assets/login.png"}
                width={150}
                height={50}
                alt="MedMapp Mobil Logotipi"
              />
            </div>
            <div className="auth-tabs">
              <button
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

            {/* Login Form Wrapper */}
            <div
              className={`form-wrapper ${
                activeForm === "login" ? "active" : ""
              }`}
              ref={loginFormWrapperRef}
            >
              {loginStep === "phone" && (
                <div className="step">
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
                          value={loginPhone}
                          onChange={(e) => setLoginPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="d-grid my-3">
                      <button
                        type="button"
                        style={{borderRadius: "10px", cursor: "pointer"}}
                        className="w-full px-2 py-3 bg-blue-500 rounded-2xl text-white"
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
                <div className="step">
                  <h3 className="fw-bold mb-2">Tasdiqlash</h3>
                  <p className="text-secondary mb-3">
                    +998 {loginPhone} raqamiga yuborilgan 6 xonali kodni
                    kiriting.
                  </p>
                  <form
                    onSubmit={(e) => handleLoginSubmit(e, loginOtp.join(""))}
                  >
                    <div className={`otp-input-fields`}>
                      {loginOtp.map((digit, index) => (
                        <input
                          key={index}
                          type="tel"
                          className={`otp-input ${otpError ? "error" : ""}`}
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
                          ref={(el) => {
                            if (el) loginOtpInputsRef.current[index] = el;
                          }}
                        />
                      ))}
                    </div>
                    <div className="validation-message">
                      {otpError && "Kod noto'g'ri kiritildi."}
                    </div>
                       <div className="d-grid my-3">
                      <button
                        type="submit"
                       style={{borderRadius: "10px", cursor: "pointer"}}
                        className="w-full px-2 py-3 bg-blue-500 rounded-2xl text-white"
                        disabled={loginOtp.join("").length !== 6}
                      >
                        {isLoading ? (
                          <p className="flex justify-center items-center w-full relative top-3">
                            <AiOutlineLoading className="animate-spin duration-300 transiton-all" />
                          </p>
                        ) : (
                          <span className="btn-text">Tasdiqlash</span>
                        )}
                      </button>
                    </div>
                    <div className="text-center small">
                      {isResendDisabled ? (
                        <span className="text-secondary">
                          Qayta yuborish uchun: {timer}s
                        </span>
                      ) : (
                        <a
                          href="#"
                          className="form-switch-link"
                          onClick={(e) => {
                            e.preventDefault();
                            handleLoginSendCode();
                          }}
                        >
                          Qayta yuborish
                        </a>
                      )}
                    </div>
                    <p className="text-center small mt-3">
                      <a
                        href="#"
                        className="form-switch-link back-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setLoginStep("phone");
                          setLoginOtp(Array(6).fill(""));
                          setOtpError(false);
                          if (timerIntervalRef.current)
                            clearInterval(timerIntervalRef.current);
                        }}
                      >
                        <i className="bi bi-arrow-left-circle"></i> Orqaga
                      </a>
                    </p>
                  </form>
                </div>
              )}
            </div>

            {/* Register Form Wrapper */}
            <div
              className={`form-wrapper ${
                activeForm === "register" ? "active" : ""
              }`}
              ref={registerFormWrapperRef}
            >
              {registerStep === "phone" && (
                <div className="step">
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
                       style={{borderRadius: "10px", cursor: "pointer"}}
                        className="w-full px-2 py-3 bg-white rounded-2xl text-[#000]"
                        
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
                          value={registerPhone}
                          onChange={(e) => setRegisterPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="d-grid my-3">
                      <button
                        type="button"
                       style={{borderRadius: "10px", cursor: "pointer"}}
                        className="w-full px-2 py-3 bg-blue-500 rounded-2xl text-white"
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
                <div className="step">
                  <h3 className="fw-bold mb-2">Tasdiqlash</h3>
                  <p className="text-secondary mb-3">
                    +998 {registerPhone} raqamiga yuborilgan 6 xonali kodni
                    kiriting.
                  </p>
                  <form
                    onSubmit={(e) =>
                      handleRegisterSubmit(e, registerOtp.join(""))
                    }
                  >
                    <div className={`otp-input-fields`}>
                      {registerOtp.map((digit, index) => (
                        <input
                          key={index}
                          type="tel"
                          className={`otp-input ${otpError ? "error" : ""}`}
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
                          ref={(el) => {
                            if (el) registerOtpInputsRef.current[index] = el;
                          }}
                        />
                      ))}
                    </div>
                    <div className="validation-message">
                      {otpError && "Kod noto'g'ri kiritildi."}
                    </div>
                      <div className="d-grid my-3">
                      <button
                        type="submit"
                        id="login-verify-btn"
                        className="btn btn-primary btn-lg flex justify-center items-center"
                        disabled={registerOtp.join("").length !== 6}
                      >
                        {isLoading ? (
                          <p className="flex justify-center items-center w-full relative top-3">
                            <AiOutlineLoading className="animate-spin duration-300 transiton-all" />
                          </p>
                        ) : (
                          <span className="btn-text">Kirish</span>
                        )}
                      </button>
                    </div>
                    <div className="text-center small">
                      {isResendDisabled ? (
                        <span className="text-secondary">
                          Qayta yuborish uchun: {timer}s
                        </span>
                      ) : (
                        <a
                          href="#"
                          className="form-switch-link"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRegisterSendCode();
                          }}
                        >
                          Qayta yuborish
                        </a>
                      )}
                    </div>
                    <p className="text-center small mt-3">
                      <a
                        href="#"
                        className="form-switch-link back-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setRegisterStep("phone");
                          setRegisterOtp(Array(6).fill(""));
                          setOtpError(false);
                          if (timerIntervalRef.current)
                            clearInterval(timerIntervalRef.current);
                        }}
                      >
                        <i className="bi bi-arrow-left-circle"></i> Orqaga
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
