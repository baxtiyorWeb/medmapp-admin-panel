import React from "react";
import { BsCartX } from "react-icons/bs";

const OrderedService = () => {
  return (
    <div className="mb-5">
      <h1 className="text-xl mb-4 mt-10  font-bold text-slate-800 ">
        Buyurtma qilingan xizmatlar
      </h1>
      <div className="mt-5 col-span-1 lg:col-span-2 bg-white  rounded-2xl p-6 text-center shadow-sm">
        <i className="bi bi-cart-x text-4xl text-slate-400"></i>
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
