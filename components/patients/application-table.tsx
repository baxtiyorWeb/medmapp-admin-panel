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
import { FaEye } from "react-icons/fa";

// TYPE DEFINITIONS

/**
 * @interface ApplicationDetails
 * @description Defines the structure for the detailed information within an application.
 */
interface ApplicationDetails {
  complaint: string;
  documents: string[];
  services: string[];
}

/**
 * @interface Application
 * @description Defines the structure for an application object used within the frontend.
 */
interface Application {
  id: string;
  application_id: string;
  clinic: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  details: ApplicationDetails;
  reason?: string; // Optional reason for rejection
}

/**
 * @interface BackendApplication
 * @description Defines the raw structure of an application object received from the backend API.
 */
interface BackendApplication {
  application_id: number;
  clinic_name: string;
  created_at: string;
  status: "new" | "processing" | "approved" | "rejected";
  complaint: string;
}

/**
 * @interface PaginatedBackendResponse
 * @description Defines the structure for a paginated API response from the backend.
 */
interface PaginatedBackendResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API FETCHING FUNCTION

/**
 * Fetches applications from the backend and maps them to the frontend Application type.
 * @returns {Promise<Application[]>} A promise that resolves to an array of applications.
 */
const fetchApplications = async (): Promise<Application[]> => {
  const response = await api.get("/applications/applications/");
  if (response.status !== 200) {
    throw new Error("Failed to fetch applications");
  }

  // Expect a paginated response object from the API
  const data: PaginatedBackendResponse<BackendApplication> = response.data;

  // Safely map the results array, returning an empty array if it doesn't exist.
  const mappedApplications: Application[] = (data?.results || []).map(
    (app) => ({
      id: String(app.application_id),
      application_id: String(app.application_id),
      clinic: app.clinic_name,
      date: new Date(app.created_at).toISOString().split("T")[0],
      status:
        app.status === "new" || app.status === "processing"
          ? "pending"
          : (app.status as "approved" | "rejected"),
      details: {
        complaint: app.complaint,
        documents: [], // Assuming documents are fetched separately or not needed in the table view
        services: [], // Assuming services are fetched separately
      },
      reason: app.status === "rejected" ? "Hujjatlar to'liq emas" : undefined,
    })
  );
  return mappedApplications;
};

// MAIN COMPONENT

const Table = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Use TanStack Query to fetch, cache, and manage server state
  const {
    data: applications,
    isLoading,
    isError,
    error,
  } = useQuery<Application[], Error>({
    queryKey: ["applications"], // Unique key for this query
    queryFn: fetchApplications, // The function that will fetch the data
  });

  // Filter applications based on current search and status filters
  const filteredApplications = applications?.filter((app) => {
    const searchMatch = app.id
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const statusMatch =
      filters.status === "all" || app.status === filters.status;
    return searchMatch && statusMatch;
  });

  // Event Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, status: e.target.value });
  };

  const openModal = (appId: string) => {
    const app = applications?.find((a) => a.id === appId);
    if (app) {
      setSelectedApp(app);
    }
  };

  const closeModal = () => {
    setSelectedApp(null);
  };

  // RENDER HELPERS

  /**
   * Renders a styled status badge based on the application status.
   * @param {string} status - The status of the application.
   * @returns {JSX.Element | null} A JSX element for the badge or null.
   */
  const renderStatusBadge = (status: string): JSX.Element | null => {
    switch (status) {
      case "pending":
        return (
          <span className="status-badge status-pending">
            <BsHourglassSplit /> Ko'rib chiqilmoqda
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
    <main className="flex-1 overflow-y-auto rounded-2xl shadow-lg main-content">
      {/* Header with Title and Filters */}
      <div className="main-content-header p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-lg font-bold main-content-title">
          Mening arizalarim
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 main-content-search-icon"></i>
            <input
              type="text"
              id="searchInput"
              placeholder="Ariza ID bo'yicha..."
              className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none main-content-search-input"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
          <div className="relative">
            <select
              id="statusFilter"
              className="w-full sm:w-auto pl-4 pr-8 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none main-content-select"
              value={filters.status}
              onChange={handleStatusChange}
            >
              <option value="all">Barcha holatlar</option>
              <option value="pending">Ko'rib chiqilmoqda</option>
              <option value="approved">Tasdiqlangan</option>
              <option value="rejected">Bekor qilingan</option>
            </select>
            <i className="bi bi-chevron-down absolute right-3 top-1/2 -translate-y-1/2 main-content-search-icon pointer-events-none"></i>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="p-6 text-center text-slate-500 flex justify-center">
          <AiOutlineLoading className="text-2xl animate-spin duration-300 transition-all loading-spinner-primary" />
        </div>
      )}
      {isError && (
        <p className="p-6 text-center text-red-500">{error.message}</p>
      )}

      {/* Table or Empty State */}
      {!isLoading && !isError && filteredApplications?.length === 0 ? (
        <div className="p-6 text-center text-slate-500">
          <p>Hech qanday ariza topilmadi.</p>
          {filters.search || filters.status !== "all" ? (
            <p>Filtrlarni tozalab, qayta urinib ko'ring.</p>
          ) : (
            <p>Siz hali hech qanday ariza yubormagansiz.</p>
          )}
        </div>
      ) : (
        !isLoading &&
        !isError && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left main-content-table">
              <thead className="text-xs uppercase main-content-table-head">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Ariza ID
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
                  <tr key={app.id} className="main-content-table-row">
                    <td className="px-6 py-4 h-[61px] font-bold main-content-table-cell id">
                      {app.id}
                    </td>
                    <td className="px-6 py-4 h-[61px] main-content-table-cell">
                      {app.date}
                    </td>
                    <td className="px-6 py-4 h-[61px]">
                      {renderStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 h-[61px] flex justify-end items-center space-x-1 text-right">
                      <button
                        className="view-details-btn cursor-pointer hover:underline"
                        onClick={() => openModal(app.id)}
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openModal(app.id)}
                        className="view-details-btn text cursor-pointer hover:underline"
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
        className="p-6 sm:p-8 border-t border-[var(--border-color)] main-content-header flex justify-end"
      >
        {/* Add pagination logic here if needed */}
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop active"
          onClick={closeModal}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="modal-content w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col border rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--card-background)",
              color: "var(--text-color)",
              borderColor: "var(--border-color)",
            }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-5 border-b border-[var(--border-color)]">
              <div>
                <h3 className="text-xl font-semibold modal-title">
                  Ariza #{selectedApp.id}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="modal-close-btn -mt-2 -mr-2 transition"
              >
                <i className="bi bi-x-lg text-2xl"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-[var(--card-background)] overflow-y-auto space-y-6 modal-body">
              {/* General Information */}
              <div>
                <h4 className="font-semibold mb-2 modal-section-title">
                  Umumiy ma'lumot
                </h4>
                <div className="p-4 bg-[var(--card-background)] var(--border-color) var(--text-color) rounded-lg space-y-3 text-sm modal-card border">
                  <div className="flex justify-between">
                    <span>Yuborilgan sana:</span>
                    <span className="font-medium">{selectedApp.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Holati:</span>
                    {renderStatusBadge(selectedApp.status)}
                  </div>
                  {selectedApp.status === "rejected" && (
                    <div
                      className="flex justify-between"
                      style={{ color: "var(--danger-light)" }}
                    >
                      <span>Bekor qilinish sababi:</span>
                      <span className="font-medium">{selectedApp.reason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Complaint Details */}
              <div>
                <h4 className="font-semibold mb-2 modal-section-title">
                  Shikoyatlar
                </h4>
                <div
                  className="p-4 rounded-lg modal-card border"
                  style={{
                    backgroundColor: "var(--card-background)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <p>{selectedApp.details.complaint}</p>
                </div>
              </div>

              {/* Uploaded Documents */}
              <div>
                <h4 className="font-semibold mb-2 modal-section-title">
                  Yuklangan Hujjatlar
                </h4>
                <div
                  className="p-4 rounded-lg space-y-2 modal-card border"
                  style={{
                    backgroundColor: "var(--card-background)",
                    color: "var(--text-color)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {selectedApp.details.documents.length > 0 ? (
                    selectedApp.details.documents.map((doc, index) => (
                      <a
                        key={index}
                        href="#"
                        className="flex items-center gap-3 modal-card-link"
                        style={{ color: "var(--primary-color)" }}
                      >
                        <i className="bi bi-file-earmark-arrow-down-fill"></i>
                        <span>{doc}</span>
                      </a>
                    ))
                  ) : (
                    <p>Hujjatlar yuklanmagan.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-end p-5 border-t border-[var(--border-color)] modal-footer"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--primary-light)",
              }}
            >
              <button
                onClick={closeModal}
                type="button"
                className="font-bold py-2 px-5 rounded-lg cursor-pointer"
                style={{
                  backgroundColor: "#4154F1",
                  color: "white",
                }}
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
