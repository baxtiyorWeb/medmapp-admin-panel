// components/Portal.tsx
import React from "react";
import { User, HeartPulse, Headset, Hospital } from "lucide-react";
import { BsShieldLock } from "react-icons/bs";
import Link from "next/link";

const Portal = () => {
 

  return (
    <main className="main-container">
      <div className="portal-container">
        <div className="logo-container">
          <img src="images/MedMapp_Logo_shaffof.png" alt="MedMapp.uz Logo" />
        </div>
        <div className="mb-6">
          <h1 className="text-[32px] mb-3 text-[#212529] font-bold leading-[32px]">
            Platformaga kirish
          </h1>
          <span className="text-[#6c757D] font-light text-[20px]">
            O&apos;z rolingizni tanlang va tizimga kiring.
          </span>
        </div>
        <div className="row g-4 justify-center flex flex-wrap w-full gap-4">
          <div className="col-lg-4 col-md-6 w-[384px] h-[334px]">
            <Link href="/patients-panel" className="portal-card">
              <div className="icon-wrapper">
                <i className="bi bi-person"></i>
              </div>
              <h3>Bemor Kabineti</h3>
              <p>
                Uchrashuvlar tarixi, tahlil natijalari va shaxsiy
                ma&apos;lumotlarni ko&apos;rish.
              </p>
              <span className="btn-login">
                Kirish <i className="bi bi-arrow-right-short"></i>
              </span>
            </Link>
          </div>
          <div className="col-lg-4 col-md-6 w-[384px] h-[334px]">
            <Link href="/doctors" className="portal-card doctor-card">
              <div className="icon-wrapper">
                <i className="bi bi-heart-pulse"></i>
              </div>
              <h3>Shifokor Kabineti</h3>
              <p>
                Qabullar jadvali, bemorlar ro&apos;yxati va maslahatlarni
                boshqarish.
              </p>
              <span className="btn-login">
                Kirish <i className="bi bi-arrow-right-short"></i>
              </span>
            </Link>
          </div>
          <div className="col-lg-4 col-md-6 w-[384px] h-[334px]">
            <Link href="/operator" className="portal-card operator-card">
              <div className="icon-wrapper">
                <i className="bi bi-headset"></i>
              </div>
              <h3>Operator Paneli</h3>
              <p>
                Bemorlar va klinikalar o&apos;rtasidagi jarayonlarni,
                so&apos;rovlarni va qo&apos;llab-quvvatlashni boshqarish.
              </p>
              <span className="btn-login">
                Kirish <i className="bi bi-arrow-right-short"></i>
              </span>
            </Link>
          </div>
          <div className="col-lg-4 col-md-6 w-[384px] h-[334px]">
            <Link href="clinic/index.html" className="portal-card admin-card">
              <div className="icon-wrapper">
                <i className="bi bi-hospital"></i>
              </div>
              <h3>Klinika Administratori</h3>
              <p>
                Klinika faoliyati, shifokorlar va moliyaviy hisobotlarni
                boshqarish.
              </p>
              <span className="btn-login">
                Kirish <i className="bi bi-arrow-right-short"></i>
              </span>
            </Link>
          </div>
          <div className="col-lg-4 col-md-6 w-[384px] h-[334px]">
            <Link
              href="superadmin/index.html"
              className="portal-card superadmin-card"
            >
              <div className="icon-wrapper">
                <i className="bi bi-shield-lock"></i>
              </div>
              <h3>Super Admin Paneli</h3>
              <p>
                Platformaning barcha tizimlarini markazlashgan holda boshqarish.
              </p>
              <span className="btn-login">
                Kirish <i className="bi bi-arrow-right-short"></i>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Portal;
