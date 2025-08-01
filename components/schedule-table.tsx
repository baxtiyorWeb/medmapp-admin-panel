// components/Schedule.tsx
import React from "react";

const appointments = [
  {
    id: 1,
    name: "Ali Valiyev",
    title: "Konsultatsiya",
    time: "10:30",
    statusColor: "border-l-emerald-500",
    bg: "bg-emerald-50/50",
    initials: "A",
  },
  {
    id: 2,
    name: "Jamila Ahmedova",
    title: "EKG",
    time: "11:30",
    statusColor: "border-l-indigo-500",
    bg: "bg-indigo-50/50",
    initials: "J",
  },
  {
    id: 3,
    name: "Sarvinoz Karimova",
    title: "Takroriy koʻrik",
    time: "14:00",
    statusColor: "border-l-amber-500",
    bg: "bg-amber-50/50",
    initials: "S",
  },
];

const Schedule = () => {
  return (
    <div className="w-full max-w-full bg-white rounded-xl p-6 border border-gray-200 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Kun Tartibi
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            2025, 30-iyul, Chorshanba
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            ‹
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all">
            Bugun
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            ›
          </button>
          <input
            type="date"
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            defaultValue="2025-07-30"
          />
          <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center space-x-2">
            <span>＋</span>
            <span>Yangi uchrashuv</span>
          </button>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="relative border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/30">
        {/* Soatlar */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-white z-10 shadow-sm">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-20 text-sm text-gray-500 pl-4 pt-2 border-b border-gray-100 font-medium"
            >
              {`${8 + i}:00`}
            </div>
          ))}
        </div>

        {/* Appointments */}
        <div className="ml-20 relative h-[800px] p-4">
          {appointments.map((appt) => {
            const top =
              (parseInt(appt.time.split(":")[0]) - 8) * 80 +
              (parseInt(appt.time.split(":")[1]) / 60) * 80;
            return (
              <div
                key={appt.id}
                className={`absolute left-6 right-6 ${appt.bg} ${appt.statusColor} border-l-4 rounded-xl p-4 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer backdrop-blur-sm`}
                style={{ top: `${top}px` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-white border border-gray-200 text-base font-bold flex items-center justify-center text-gray-800 shadow-sm">
                    {appt.initials}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-base">
                      {appt.name}
                    </div>
                    <div className="text-sm text-gray-600">{appt.title}</div>
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {appt.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
