"use client";

import React from "react";
import { AiOutlineSearch, AiOutlineEdit } from "react-icons/ai";
import { MdOutlineDvr } from "react-icons/md";
import { RiFilter3Line } from "react-icons/ri";

const patients = [
  {
    id: 501,
    name: "Ali Valiyev",
    phone: "+998 90 123-45-67",
    lastVisit: "30.07.2025",
    status: "Faol",
    status_color: "bg-green-100 text-green-700",
  },
  {
    id: 502,
    name: "Sarvinoz Karimova",
    phone: "+998 93 987-65-43",
    lastVisit: "29.07.2025",
    status: "Faol",
    status_color: "bg-green-100 text-green-700",
  },
  {
    id: 503,
    name: "Karim Anvarov",
    phone: "+998 99 555-11-22",
    lastVisit: "15.06.2025",
    status: "Nofaol",
    status_color: "bg-red-100 text-red-700",
  },
];

const PatientTable = () => {
  return (
    <div className="w-full bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-md font-[Inter]">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-auto flex-1">
          <input
            type="text"
            placeholder="Bemor ismi, telefoni boʻyicha qidirish..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <AiOutlineSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
        <div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors text-sm w-full sm:w-auto">
            <RiFilter3Line size={18} />
            <span>Holati</span>
          </button>
        </div>
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left font-medium">BEMOR</th>
              <th className="px-6 py-3 text-left font-medium">
                TELEFON RAQAMI
              </th>
              <th className="px-6 py-3 text-left font-medium">
                OXIRGI TASHRIF
              </th>
              <th className="px-6 py-3 text-left font-medium">HOLATI</th>
              <th className="px-6 py-3 text-left font-medium">AMALLAR</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-base mr-4">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {patient.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {patient.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {patient.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {patient.lastVisit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.status_color}`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                      <MdOutlineDvr size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                      <AiOutlineEdit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 sm:hidden">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="border border-gray-100 rounded-xl p-4 shadow-md bg-gradient-to-br from-white via-gray-50 to-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 text-white font-semibold flex items-center justify-center mr-4 shadow-sm">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-base">
                    {patient.name}
                  </p>
                  <p className="text-xs text-gray-500">ID: {patient.id}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${patient.status_color}`}
              >
                {patient.status}
              </span>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium text-gray-600">📞 Telefon:</span>{" "}
                {patient.phone}
              </p>
              <p>
                <span className="font-medium text-gray-600">
                  📅 Oxirgi tashrif:
                </span>{" "}
                {patient.lastVisit}
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                <MdOutlineDvr size={18} className="text-gray-600" />
              </button>
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                <AiOutlineEdit size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3 text-sm text-gray-600">
        <p>Natijalar: 1-3 dan 58 ta</p>
        <div className="flex items-center flex-wrap gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100">
            Oldingisi
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-blue-500 text-white">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100">
            Keyingisi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientTable;
