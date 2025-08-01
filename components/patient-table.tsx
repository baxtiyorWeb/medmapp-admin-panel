// components/PatientTable.js
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
    <div className="w-full max-w-full bg-white rounded-xl p-6 border border-gray-200 shadow-md font-[Inter]">
      {/* Yuqori qism */}
      <div className="flex items-center justify-between mb-6 space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Bemor ismi, telefoni boʻyicha qidirish..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-[Inter]"
          />
          <AiOutlineSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <div className="relative">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors font-[Inter]">
            <RiFilter3Line size={18} />
            <span>Holati</span>
          </button>
        </div>
      </div>

      {/* Jadval qismi */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 font-[Inter]">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[Inter]">
                BEMOR
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[Inter]">
                TELEFON RAQAMI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[Inter]">
                OXIRGI TASHRiF
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[Inter]">
                HOLATI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-[Inter]">
                AMALLAR
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold text-lg mr-4 font-[Inter]">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 font-[Inter]">
                        {patient.name}
                      </div>
                      <div className="text-xs text-gray-500 font-[Inter]">
                        ID: {patient.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-[Inter]">
                  {patient.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-[Inter]">
                  {patient.lastVisit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.status_color} font-[Inter]`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-[Inter]">
                  <div className="flex space-x-2 text-gray-500">
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

      {/* Sahifalash */}
      <div className="flex items-center justify-between mt-6 font-[Inter]">
        <p className="text-sm text-gray-500">Natijalar: 1-3 dan 58 ta</p>
        <div className="flex items-center space-x-2 text-sm font-medium">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors">
            Oldingisi
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md bg-blue-500 text-white">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors">
            Keyingisi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientTable;
