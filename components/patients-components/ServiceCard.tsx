import React from "react";

const ServiceCard = () => {
  return (
    <div>
      <h1 className="text-xl my-4 font-bold text-slate-800 dark:text-white">
        Qo&apos;shimcha xizmatlar
      </h1>
      <div
        id="service-cards-container"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
      >
        <div
          className="service-card bg-white  rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="invitation"
        >
          <div className="price-tag">$100</div>
          <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-patch-check-fill text-3xl text-[rgb(79_70_229)]"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            Taklifnoma &amp; Viza
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Klinikadan taklifnoma oling va viza masalalarida yordam
            so&apos;rang.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">
              Taklifnoma bepul, Viza $100
            </p>
            <button className="service-btn w-full bg-[#eef2ff] dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition">
              Buyurtma
            </button>
          </div>
        </div>

        <div
          className="service-card bg-white  rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="transfer"
        >
          <div className="free-ribbon">
            <span>Bepul</span>
          </div>
          <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-airplane text-3xl text-primary"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            Transfer Xizmati
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Aeroportdan kutib olish va klinikaga qulay yetib borishni
            ta&apos;minlang.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">Bepul</p>
            <button className="service-btn w-full bg-primary-50 dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition">
              Buyurtma
            </button>
          </div>
        </div>

        <div
          className="service-card bg-white  rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="hotel"
        >
          <div className="price-tag">$200</div>
          <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-building-check text-3xl text-primary"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            Mehmonxona
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Klinikaga yaqin va qulay mehmonxonalardan joy band qiling.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">
              Turiga qarab, o&apos;rtacha 10 kunga $200
            </p>
            <button className="service-btn w-full bg-primary-50 dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition">
              Buyurtma
            </button>
          </div>
        </div>

        <div
          className="service-card bg-white  rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="translator"
        >
          <div className="free-ribbon">
            <span>Bepul</span>
          </div>
          <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-translate text-3xl text-primary"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            Tarjimon Xizmati
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Davolanish jarayonida til bilan bog&apos;liq muammolarga duch
            kelmang.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">Bepul</p>
            <button className="service-btn w-full bg-primary-50 dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition">
              Buyurtma
            </button>
          </div>
        </div>

        <div
          className="service-card bg-white  rounded-2xl p-5 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          data-service-id="simcard"
        >
          <div className="price-tag">$15</div>
          <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 flex items-center justify-center mb-4">
            <i className="bi bi-sim text-3xl text-primary"></i>
          </div>
          <h4 className="font-bold text-slate-800 dark:text-white mb-1">
            SIM-karta
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex-grow">
            Borgan davlatingizda yaqinlaringiz bilan aloqada bo&apos;ling.
          </p>
          <div className="mt-4 w-full">
            <p className="text-xs text-slate-400 mb-2 h-8">
              $15 dan boshlanadi
            </p>
            <button className="service-btn w-full bg-primary-50 dark:bg-primary-800/50 text-primary-600 dark:text-primary-200 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-100 dark:hover:bg-primary-700 transition">
              Buyurtma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
