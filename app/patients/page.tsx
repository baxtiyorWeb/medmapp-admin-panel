import DashboardStatisticsNumbers from "@/components/dashboard-statistics-numbers";
import PatientTable from "@/components/patient-table";
import React from "react";

const PatientsPage = () => {
  return (
    <div>
      <div>
        <h1 className="font-[Inter] text-[28px] font-semibold leading-[33.6px] text-[#012970]">
          Bemorlar
        </h1>
        <p className="text-[16px] leading-[24px] text-[#6c757d] mt-[8px]">
          Sizga biriktirilgan bemorlar ro'yxati.
        </p>
      </div>

      <div className="mt-6 ">
        <PatientTable />
      </div>
    </div>
  );
};

export default PatientsPage;
