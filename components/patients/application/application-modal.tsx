// components/ApplicationModal.tsx
"use client";

import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
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

// 1. Asosiy modal uchun animatsiya variantlari
const modalVariants: Variants = {
  hidden: {
    opacity: 0.9,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0.9,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const stepVariants: Variants = {
  enter: { opacity: 0.9, scale: 0.98 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0.9, scale: 0.98 },
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
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    // 3. AnimatePresence modalni o'rab turishi kerak
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="z-[200] bg-[var(--background-color)] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-[var(--border-color)]">
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

            {/* Progress */}
            <div className="flex-shrink-0 px-6 pt-5">
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-auto overflow-y-auto p-6 relative">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="w-full"
                >
                  <div className="w-full max-w-3xl mx-auto">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto bg-[var(--card-background)] rounded-full flex items-center justify-center border border-[var(--border-color)]">
                        <i
                          className={`bi bi-${stepInfo.icon} text-4xl text-primary-500`}
                        ></i>
                      </div>
                      <h4 className="mt-4 text-xl font-semibold text-[var(--text-color)]">
                        {stepInfo.title}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">
                        {stepInfo.description}
                      </p>
                    </div>
                    {children}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 bg-[var(--background-color)] border-t border-[var(--border-color)] rounded-b-2xl">
              <button
                type="button"
                className={`bg-[var(--card-background)] cursor-pointer text-[var(--text-color)] font-bold py-3 px-6 rounded-lg transition hover:bg-[#475569] ${
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
                  className="bg-[#069668] cursor-pointer text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:bg-emerald-300 disabled:cursor-not-allowed"
                  disabled={isSubmitDisabled}
                  onClick={onSubmit}
                >
                  {isSubmitting ? "Yuborilmoqda..." : "Tasdiqlash va yuborish"}
                  <BsSendCheck />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApplicationModal;
