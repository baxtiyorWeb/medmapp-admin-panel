"use client";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { isArray } from "lodash";
import React from "react";
import { get } from "sortablejs";

const appointments = [
  {
    id: 1,
    name: "Ali Valiyev",
    title: "Konsultatsiya",
    time: "10:30 - 11:30",
    status: "Tugatildi",
    status_color: "text-green-600",
  },
  {
    id: 2,
    name: "Jamila Ahmedova",
    title: "EKG",
    time: "11:30 - 12:00",
    status: "Jarayonda",
    status_color: "text-blue-600",
  },
  {
    id: 3,
    name: "Sarvinos Karimova",
    title: "Takroriy koʻrik",
    time: "14:00 - 14:30",
    status: "Kutilmoqda",
    status_color: "text-yellow-600",
  },
];

const AppointmentTable = () => {
  

  // const usersitems = isArray(data?.data) ? get("data", {}) : [];

  return (
    <div className="w-full max-w-full bg-white rounded-xl p-6 border border-gray-200 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 font-[Inter]">
          Bugungi uchrashuvlar roʻyxati
        </h2>
        <a
          href="#"
          className="text-blue-500 hover:text-blue-700 text-sm font-medium font-[Inter]"
        >
          Barchasini koʻrish
        </a>
      </div>

      <div className="overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-4 px-2 whitespace-nowrap">
                  <div className="flex items-center space-x-5">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-lg font-[Inter]">
                      {appointment.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900 font-[Inter]">
                        {appointment.name}
                      </div>
                      <div className="text-sm text-gray-500 font-[Inter]">
                        {appointment.title}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-2 whitespace-nowrap text-right">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900 font-[Inter]">
                      {appointment.time}
                    </div>
                    <div
                      className={`text-xs mt-1 ${appointment.status_color} font-[Inter]`}
                    >
                      {appointment.status}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentTable;
