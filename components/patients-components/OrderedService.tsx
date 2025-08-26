import React from "react";
import { BsCartX } from "react-icons/bs";

const OrderedService = () => {
  return (
    <div className="mb-5">
      <h1 className="text-xl mb-4 mt-10  font-bold text-slate-800 dark:text-white">
        Buyurtma qilingan xizmatlar
      </h1>
      <div className="bg-white flex justify-center items-center flex-col  rounded-2xl p-6 text-center shadow w-full">
        <BsCartX className="text-4xl text-center text-slate-400" />
        <p className="mt-2 font-medium text-slate-600 dark:text-slate-300">
          Hozircha xizmatlar buyurtma qilinmagan
        </p>
        <p className="text-sm text-slate-500">
          Xizmat buyurtma qilganingizdan so&apos;ng u shu yerda ko&apos;rinadi.
        </p>
      </div>
    </div>
  );
};

export default OrderedService;
