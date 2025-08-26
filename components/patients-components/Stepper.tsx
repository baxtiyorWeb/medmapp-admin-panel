import React from "react";
import { BsFillPersonBadgeFill } from "react-icons/bs";
import { BsHeartPulseFill, BsPaperclip, BsCheck2Circle } from "react-icons/bs";

const Stepper = () => {
  const steps = [
    {
      label: "Shaxsiy",
      icon: <BsFillPersonBadgeFill className="text-xl text-white" />,
    },
    {
      label: "Tibbiy",
      icon: <BsHeartPulseFill className="text-xl text-white" />,
    },
    {
      label: "Hujjatlar",
      icon: <BsPaperclip className="text-xl text-white" />,
    },
    {
      label: "Tekshirish",
      icon: <BsCheck2Circle className="text-xl text-white" />,
    },
  ];

  return (
    <div>
      <div id="stepper" className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              className="step flex-1 flex flex-col items-center text-center"
              data-step={index + 1}
            >
              <div className="step-icon-container w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 border-2 bg-[rgb(79_70_229)] border-[rgb(79_70_229)]">
                {step.icon}
              </div>
              <p className="mt-2 text-sm transition-colors duration-300 text-slate-500 dark:text-slate-400 font-semibold text-primary-600 dark:text-primary-200">
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-slate-300 dark:bg-slate-600"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
