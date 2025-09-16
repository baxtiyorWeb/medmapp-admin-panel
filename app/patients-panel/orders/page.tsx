import React from "react";

const OrdersPage = () => {
  return (
    // ASOSIY O'ZGARISH SHU YERDA
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
      {/* 1-Kartochka (Sizning kodingiz) */}
      <div className="bg-[var(--card-background)] rounded-2xl p-5 shadow-sm">
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
                <i className="bi bi-paperclip text-[var(--text-color)]"></i> 6.
                Жираф.jpg
              </span>
            </span>
          </div>
          <div className="text-sm">
            <strong className="font-medium text-[var(--text-color)] ">
              Reys raqami:
            </strong>{" "}
            <span className=" text-[var(--text-light)]">&apos;pk&apos;</span>
          </div>
          <div className="text-sm">
            <strong className="font-medium  text-[var(--text-color)]">
              Uchib kelish sanasi va vaqti:
            </strong>{" "}
            <span className="text-[var(--text-light)]">2025 M09 14 10:57</span>
          </div>
        </div>
      </div>

      {/* 2-Kartochka (Namuna) */}
      <div className="bg-[var(--card-background)] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-4 pb-3 border-b border-[var(--border-color)]">
          <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0">
            <i className="bi bi-building text-2xl text-orange-500"></i>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-color)]">Mehmonxona</h4>
            <p className="text-xs text-yellow-500 font-semibold">Kutilmoqda</p>
          </div>
        </div>
        <div className="pt-4 space-y-2">
          <div className="text-sm">
            <strong className="font-medium text-[var(--text-color)]">
              Manzil:
            </strong>{" "}
            <span className="text-[var(--text-light)]">
              Samarqand sh., Registon ko&apos;ch.
            </span>
          </div>
          <div className="text-sm">
            <strong className="font-medium text-[var(--text-color)]">
              Band qilingan kunlar:
            </strong>{" "}
            <span className="text-[var(--text-light)]">
              15.09.2025 - 20.09.2025
            </span>
          </div>
        </div>
      </div>

      {/* 3-Kartochka (Namuna) */}
      <div className="bg-[var(--card-background)] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-4 pb-3 border-b border-[var(--border-color)]">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
            <i className="bi bi-clipboard2-pulse text-2xl text-red-500"></i>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text-color)]">
              Tibbiy Konsultatsiya
            </h4>
            <p className="text-xs text-red-500 font-semibold">Bekor qilingan</p>
          </div>
        </div>
        <div className="pt-4 space-y-2">
          <div className="text-sm">
            <strong className="font-medium text-[var(--text-color)]">
              Shifokor:
            </strong>{" "}
            <span className="text-[var(--text-light)]">Dr. Alimov</span>
          </div>
          <div className="text-sm">
            <strong className="font-medium text-[var(--text-color)]">
              Sana:
            </strong>{" "}
            <span className="text-[var(--text-light)]">16.09.2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
