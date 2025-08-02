// components/Portal.tsx
import React from "react";
import { User, HeartPulse, Headset, Hospital } from "lucide-react";
import { BsShieldLock } from "react-icons/bs";

const Portal = () => {
  const roles = [
    {
      id: 1,
      title: "Bemor Kabineti",
      description:
        "Uchrashuvlar tarixi, tahlil natijalari va shaxsiy ma'lumotlarni ko'rish.",
      icon: <User className="text-xl" />,
      link: "/patient",
      color: "bg-blue-100 text-blue-600",
      buttonColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Shifokor Kabineti",
      description:
        "Qabullar jadvali, bemorlar ro'yxati va maslahatlarni boshqarish.",
      icon: <HeartPulse className="text-xl" />,
      link: "/doctor",
      color: "bg-emerald-100 text-emerald-600",
      buttonColor: "text-emerald-600",
    },
    {
      id: 3,
      title: "Operator Paneli",
      description:
        "Bemorlar va klinikalar o'rtasidagi jarayonlarni, so'rovlarni va qo'llab-quvvatlashni boshqarish.",
      icon: <Headset className="text-xl" />,
      link: "/admin",
      color: "bg-teal-100 text-teal-600",
      buttonColor: "text-teal-600",
    },
    {
      id: 4,
      title: "Klinika Administratori",
      description:
        "Klinika faoliyati, shifokorlar va moliyaviy hisobotlarni boshqarish.",
      icon: <Hospital className="text-xl" />,
      link: "/clinic",
      color: "bg-yellow-100 text-yellow-600",
      buttonColor: "text-yellow-600",
    },
    {
      id: 5,
      title: "Super Admin Paneli",
      description:
        "Platformaning barcha tizimlarini markazlashgan holda boshqarish.",
      icon: <BsShieldLock className="text-xl" />,
      link: "/superadmin",
      color: "bg-red-100 text-red-600",
      buttonColor: "text-red-600",
    },
  ];

  return (
    <main className="main-container">
      <div className="portal-container">
        <div className="logo-container">
          <img src="images/MedMapp_Logo_shaffof.png" alt="MedMapp.uz Logo" />
        </div>
        <div className="mb-6">
          <h1 className="text-[32px] mb-3  text-[#212529] font-bold leading-[32px]">
            Platformaga kirish
          </h1>
          <span className="text-[#6c757D] font-light text-[20px]">
            O'z rolingizni tanlang va tizimga kiring.
          </span>
        </div>
        <div className="row g-4 justify-content-center flex justify-center items-center flex-wrap w-full gap-4">
          <div className="col-lg-4 col-md-6 w-[384px] h-[334px]">
            <a href="/patients-panel" className="portal-card">
              <div className="icon-wrapper">
                <i className="bi bi-person"></i>
              </div>
              <h3>Bemor Kabineti</h3>
              <p>
                Uchrashuvlar tarixi, tahlil natijalari va shaxsiy ma'lumotlarni
                ko'rish.
              </p>
              <span className="btn-login">
                Kirish <i className="bi bi-arrow-right-short"></i>
              </span>
            </a>
          </div>
          <div className="col-lg-4 col-md-6 w-[384px] h-[334px]">
            <a href="/doctors" className="portal-card doctor-card">
              <div className="icon-wrapper">
                <i className="bi bi-heart-pulse"></i>
              </div>
              <h3>Shifokor Kabineti</h3>
              <p>
                Qabullar jadvali, bemorlar ro'yxati va maslahatlarni boshqarish.
              </p>
              <span className="btn-login">
                Kirish <i className="bi bi-arrow-right-short"></i>
              </span>
            </a>
          </div>
          <div className="col-lg-4 col-md-6 w-[384px] h-[334px]">
            <a href="admin/index.html" className="portal-card operator-card">
              <div className="icon-wrapper">
                <i className="bi bi-headset"></i>
              </div>
              <h3>Operator Paneli</h3>
              <p>
                Bemorlar va klinikalar o'rtasidagi jarayonlarni, so'rovlarni va
                qo'llab-quvvatlashni boshqarish.
              </p>
              <span className="btn-login">
                Kirish <i className="bi bi-arrow-right-short"></i>
              </span>
            </a>
          </div>
          <div className="col-lg-4 col-md-6 w-[384px] h-[334px]">
            <a href="clinic/index.html" className="portal-card admin-card">
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
            </a>
          </div>
          <div className="col-lg-4 col-md-6 w-[384px] h-[334px]">
            <a
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
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Portal;
