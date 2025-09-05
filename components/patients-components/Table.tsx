"use client";

import React, { JSX, useState } from "react";
import "./application.css";
import {
  BsCheckCircleFill,
  BsHourglassSplit,
  BsXCircleFill,
} from "react-icons/bs";
import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AiOutlineLoading } from "react-icons/ai";
import LoadingOverlay from "../LoadingOverlay";

// Define the types for the application data from the backend
interface ApplicationDetails {
  complaint: string;
  documents: string[]; // Adjust based on how you fetch documents
  services: string[]; // Not in backend; can be removed or handled separately
}

interface Application {
  id: string;
  application_id: string; // Backenddan kelgan ID
  clinic: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  details: ApplicationDetails;
  reason?: string;
}

interface BackendApplication {
  application_id: number;
  clinic_name: string;
  created_at: string;
  status: "new" | "processing" | "approved" | "rejected";
  complaint: string;
}

// Function to fetch data, to be used with TanStack Query
const fetchApplications = async (): Promise<Application[]> => {
  const response = await api.get("/applications/applications/");
  if (response.status !== 200) {
    throw new Error("Failed to fetch applications");
  }

  const data: BackendApplication[] = await response.data;

  const mappedApplications: Application[] = data.map((app) => ({
    id: String(app.application_id), // React key uchun string
    application_id: String(app.application_id), // Agar kerak bo'lsa qo'shamiz
    clinic: app.clinic_name,
    date: new Date(app.created_at).toISOString().split("T")[0],
    status:
      app.status === "new" || app.status === "processing"
        ? "pending"
        : (app.status as "approved" | "rejected"),
    details: {
      complaint: app.complaint,
      documents: [],
      services: [],
    },
    reason: app.status === "rejected" ? "Hujjatlar to'liq emas" : undefined,
  }));

  return mappedApplications;
};

const Table = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Use TanStack Query to fetch and manage data
  const {
    data: applications,
    isLoading,
    isError,
    error,
  } = useQuery<Application[], Error>({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });

  // Filter applications based on search and status
  const filteredApplications = applications?.filter((app) => {
    const searchMatch = app.id
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const statusMatch =
      filters.status === "all" || app.status === filters.status;
    return searchMatch && statusMatch;
  });

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  // Handle status filter change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, status: e.target.value });
  };

  // Handle opening modal
  const openModal = (appId: string) => {
    const app = applications?.find((a) => a.id === appId);
    if (app) {
      setSelectedApp(app);
    }
  };

  // Handle closing modal
  const closeModal = () => {
    setSelectedApp(null);
  };

  const renderStatusBadge = (status: string): JSX.Element | null => {
    switch (status) {
      case "pending":
        return (
          <span className="status-badge status-pending">
            <BsHourglassSplit /> Ko&apos;rib chiqilmoqda
          </span>
        );
      case "approved":
        return (
          <span className="status-badge status-approved">
            <BsCheckCircleFill /> Tasdiqlangan
          </span>
        );
      case "rejected":
        return (
          <span className="status-badge status-rejected">
            <BsXCircleFill /> Bekor qilingan
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <main className="flex-1 overflow-y-auto rounded-2xl shadow-lg">
      <div className="bg-white">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">
            Mening Arizalarim
          </h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow">
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                id="searchInput"
                placeholder="Ariza ID bo'yicha..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="relative">
              <select
                id="statusFilter"
                className="w-full sm:w-auto pl-4 pr-8 py-2 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none appearance-none"
                value={filters.status}
                onChange={handleStatusChange}
              >
                <option value="all">Barcha holatlar</option>
                <option value="pending">Ko&apos;rib chiqilmoqda</option>
                <option value="approved">Tasdiqlangan</option>
                <option value="rejected">Bekor qilingan</option>
              </select>
              <i className="bi bi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {isLoading && (
          <div className="p-4 text-center text-slate-500 flex justify-center">
            <AiOutlineLoading className="text-2xl text-primary animate-spin duration-300 transition-all " />
          </div>
        )}
        {isError && (
          <p className="p-4 text-center text-red-500">{error.message}</p>
        )}

        {/* Table or Empty State */}
        {!isLoading && !isError && filteredApplications?.length === 0 ? (
          <div className="p-4 text-center text-slate-500">
            <p>Hech qanday ariza topilmadi.</p>
            {filters.search || filters.status !== "all" ? (
              <p>Filtrlarni tozalab, qayta urinib ko&apos;ring.</p>
            ) : (
              <p>Siz hali hech qanday ariza yubormagansiz.</p>
            )}
          </div>
        ) : (
          !isLoading &&
          !isError && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Ariza ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Klinika
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Sana
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Holati
                    </th>
                    <th scope="col" className="px-6 py-3 text-right">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications?.map((app) => (
                    <tr
                      key={app.id}
                      className="bg-white border-b border-[#e5e7eb] hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 h-[61px] font-bold text-[rgb(65_84_241)] dark:text-primary-400">
                        {app.id}
                      </td>
                      <td className="px-6 py-4 h-[61px]">{app.clinic}</td>
                      <td className="px-6 py-4 h-[61px]">{app.date}</td>
                      <td className="px-6 py-4 h-[61px]">
                        {renderStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 h-[61px] text-right">
                        <button
                          className="view-details-btn text-[rgb(65_84_241)] hover:underline"
                          onClick={() => openModal(app.id)}
                        >
                          Batafsil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Pagination Placeholder */}
        <div
          id="pagination-controls"
          className="p-4 sm:p-6 border-t border-slate-200 flex justify-end"
        >
          {/* Add pagination logic here if needed */}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between p-5 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                  Ariza #{selectedApp.id}
                </h3>
                <p className="text-sm text-slate-500">{selectedApp.clinic}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 -mt-2 -mr-2"
              >
                <i className="bi bi-x-lg text-2xl"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h4 className="font-semibold mb-2 text-slate-700">
                  Umumiy ma&apos;lumot
                </h4>
                <div className="bg-white p-4 rounded-lg space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Yuborilgan sana:</span>
                    <span className="font-medium">{selectedApp.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Holati:</span>
                    {renderStatusBadge(selectedApp.status)}
                  </div>
                  {selectedApp.status === "rejected" && (
                    <div className="flex justify-between text-red-500 dark:text-red-400">
                      <span className="text-slate-500">
                        Bekor qilinish sababi:
                      </span>
                      <span className="font-medium">{selectedApp.reason}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-slate-700">
                  Shikoyatlar
                </h4>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-slate-600">
                    {selectedApp.details.complaint}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-slate-700">
                  Yuklangan Hujjatlar
                </h4>
                <div className="bg-white p-4 rounded-lg space-y-2">
                  {selectedApp.details.documents.length > 0 ? (
                    selectedApp.details.documents.map((doc, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex items-center gap-3 text-sm text-primary dark:text-primary-400 hover:underline"
                      >
                        <i className="bi bi-file-earmark-arrow-down-fill"></i>
                        <span>{doc}</span>
                      </a>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      Hujjatlar yuklanmagan.
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-slate-700">
                  Buyurtma qilingan xizmatlar
                </h4>
                <div className="bg-white p-4 rounded-lg space-y-2">
                  {selectedApp.details.services.length > 0 ? (
                    selectedApp.details.services.map((srv, index) => (
                      <p
                        key={index}
                        className="flex items-center gap-2 text-sm text-slate-600"
                      >
                        <i className="bi bi-check-circle text-success"></i>
                        <span>{srv}</span>
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      Xizmatlar buyurtma qilinmagan.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end p-5 border-t border-slate-200 bg-slate-100/50 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="bg-primary text-white font-bold py-2 px-5 rounded-lg hover:bg-primary-700 transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Table;
