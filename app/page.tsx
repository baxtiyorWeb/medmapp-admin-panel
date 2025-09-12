"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const App = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-[var(--background-color)]">
      <div className="w-full max-w-[1200px] text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src={"/assets/MedMapp_Logo_shaffof.png"}
            width={300}
            height={120}
            alt="MedMapp Logotipi"
            className="mb-4 max-h-[70px]"
          />
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-[32px] mb-3 font-bold leading-[32px] text-[var(--text-color)]">
            Platformaga kirish
          </h1>
          <span className="text-[var(--text-light)] font-light text-[20px]">
            O&apos;z rolingizni tanlang va tizimga kiring.
          </span>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* Bemor Kabineti */}
          <div className="w-[384px] h-[334px]">
            <Link
              href="/patients-panel"
              className="flex h-full flex-col rounded-2xl border border-[var(--border-color)] transition-all duration-300  bg-[var(--card-background)] p-10 text-center text-[var(--text-color)]  hover:-translate-y-2 hover:border-[var(--color-primary)] hover:shadow-xl"
            >
              <div className="mx-auto mb-6 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[var(--color-primary-50)] text-[28px] text-[var(--color-primary)]">
                <i className="bi bi-person"></i>
              </div>
              <h3 className="text-xl font-semibold">Bemor Kabineti</h3>
              <p className="flex-grow min-h-[60px] text-[var(--text-light)]">
                Uchrashuvlar tarixi, tahlil natijalari va shaxsiy
                ma&apos;lumotlarni ko&apos;rish.
              </p>
              <span className="mt-6 inline-flex items-center font-semibold text-[var(--color-primary)]">
                Kirish{" "}
                <i className="bi bi-arrow-right-short transition-transform group-hover:translate-x-1"></i>
              </span>
            </Link>
          </div>

          {/* Operator Paneli */}
          <div className="w-[384px] h-[334px]">
            <Link
              href="/operator"
              className="flex h-full flex-col rounded-2xl border border-[var(--border-color)] transition-all duration-300  bg-[var(--card-background)] p-10 text-center text-[var(--text-color)]  hover:-translate-y-2 hover:border-[var(--color-info)] hover:shadow-xl"
            >
              <div className="mx-auto mb-6 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[var(--info-light)] text-[28px] text-[var(--color-info)]">
                <i className="bi bi-headset"></i>
              </div>
              <h3 className="text-xl font-semibold">Operator Paneli</h3>
              <p className="flex-grow min-h-[60px] text-[var(--text-light)]">
                Bemorlar va klinikalar o&apos;rtasidagi jarayonlarni,
                so&apos;rovlarni va qo&apos;llab-quvvatlashni boshqarish.
              </p>
              <span className="mt-6 inline-flex items-center font-semibold text-[var(--color-info)]">
                Kirish{" "}
                <i className="bi bi-arrow-right-short transition-transform group-hover:translate-x-1"></i>
              </span>
            </Link>
          </div>

          {/* Super Admin */}
          <div className="w-[384px] h-[334px]">
            <Link
              href="superadmin/index.html"
              className="flex h-full flex-col rounded-2xl border border-[var(--border-color)] transition-all duration-300  bg-[var(--card-background)] p-10 text-center text-[var(--text-color)]  hover:-translate-y-2 hover:border-[var(--color-danger)] hover:shadow-xl"
            >
              <div className="mx-auto mb-6 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[var(--danger-light)] text-[28px] text-[var(--color-danger)]">
                <i className="bi bi-shield-lock"></i>
              </div>
              <h3 className="text-xl font-semibold">Super Admin Paneli</h3>
              <p className="flex-grow min-h-[60px] text-[var(--text-light)]">
                Platformaning barcha tizimlarini markazlashgan holda boshqarish.
              </p>
              <span className="mt-6 inline-flex items-center font-semibold text-[var(--color-danger)]">
                Kirish
                <i className="bi bi-arrow-right-short transition-transform group-hover:translate-x-1"></i>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
