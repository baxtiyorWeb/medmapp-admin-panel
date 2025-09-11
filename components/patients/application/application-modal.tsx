// components/ApplicationModal.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsSendCheck } from "react-icons/bs";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  totalSteps?: number;
  direction: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
  children: React.ReactNode;
  stepInfo: { icon: string; title: string; description: string };
}

const stepVariants = {
    enter: { opacity: 0, position: "absolute" },
    center: { opacity: 1, position: "relative" },
    exit: { opacity: 0, position: "absolute" },
  };

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  totalSteps = 4,
  direction,
  onPrev,
  onNext,
  onSubmit,
  isSubmitting,
  isSubmitDisabled,
  children,
  stepInfo,
}) => {
  if (!isOpen) return null;

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div
      onClick={onClose}
      className="fixed z-50 inset-0 flex items-center justify-center bg-black/80"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="z-[200] bg-[var(--background-color)] rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <h3 className="text-xl font-semibold text-[var(--text-color)]">
            Tibbiy konsultatsiya uchun anketa
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 cursor-pointer hover:text-slate-600"
            aria-label="Yopish"
          >
            <i className="bi bi-x-lg text-2xl"></i>
          </button>
        </div>
        <div className="px-6 pt-5 bg-[var(--background-color)]">
          <div className="bg-[var(--background-color)] rounded-full h-2.5">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="p-3 overflow-y-auto flex-grow relative">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              layout
              key={currentStep}
              custom={direction}
              variants={stepVariants}
              initial="center"
              animate="top"
              exit="exit"
              transition={{ type: "tween", duration: 0.1, ease: "easeInOut" }}
              className="form-step active " // yoki kerakli balandlik
              data-step={currentStep}
            >
              <div className="w-full max-w-3xl mx-auto">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto bg-[var(--card-background)] rounded-full flex items-center justify-center">
                    <i
                      className={`bi bi-${stepInfo.icon} text-4xl text-primary-500`}
                    ></i>
                  </div>
                  <h4 className="text-xl font-semibold text-[var(--text-color)]">
                    {stepInfo.title}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {stepInfo.description}
                  </p>
                </div>
                {children}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between p-4 bg-[var(--background-color)] border-t border-[var(--border-color)] rounded-b-2xl">
          <button
            type="button"
            className={`bg-[var(--card-background)] cursor-pointer text-[var(--text-color)] font-bold py-3 px-6 rounded-lg transition ${
              currentStep === 1 ? "invisible" : "visible"
            }`}
            onClick={onPrev}
          >
            Orqaga
          </button>
          {currentStep < totalSteps ? (
            <button
              type="button"
              className="bg-[#4f45e4] cursor-pointer text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-700 transition flex items-center gap-2"
              onClick={onNext}
            >
              Keyingisi <i className="bi bi-arrow-right"></i>
            </button>
          ) : (
            <button
              type="button"
              className="bg-[#069668] cursor-pointer text-white font-bold py-3 px-6 rounded-lg hover:bg-success-700 transition flex items-center gap-2 disabled:bg-[#96cab3] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitDisabled}
              onClick={onSubmit}
            >
              {isSubmitting ? "Yuborilmoqda..." : "Tasdiqlash va yuborish"}
              <BsSendCheck />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
