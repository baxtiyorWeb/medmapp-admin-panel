import React from "react";

const OrdersPage = () => {
  return (
    <div className="grid grid-cols-3 transition-all duration-300">
      <div className=" bg-[var(--card-background)] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-4 pb-3 border-b border-[var(--border-color)]">
          <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center flex-shrink-0">
            <i className="bi bi-airplane text-2xl text-primary"></i>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-color)]">
              Transfer Xizmati
            </h4>
            <p className="text-xs text-green-500 font-semibold">
              Buyurtma qilingan
            </p>
          </div>
        </div>
        <div className="pt-4 space-y-2">
          <div className="text-sm">
            <strong className="font-medium text-[var(--text-color)]">
              Aviachipta nusxasi:
            </strong>{" "}
            <span className="text-slate-700 dark:text-slate-200">
              <span className="flex items-center gap-2 text-[var(--text-light)]">
                <i className="bi bi-paperclip text-[var(--text-color)]"></i> 6. Жираф.jpg
              </span>
            </span>
          </div>
          <div className="text-sm">
            <strong className="font-medium text-[var(--text-color)] ">
              Reys raqami:
            </strong>{" "}
            <span className=" text-[var(--text-light)]">'pk'</span>
          </div>
          <div className="text-sm">
            <strong className="font-medium  text-[var(--text-color)]">
              Uchib kelish sanasi va vaqti:
            </strong>{" "}
            <span className="text-[var(--text-light)]">
              2025 M09 14 10:57
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
