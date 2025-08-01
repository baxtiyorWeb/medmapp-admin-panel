import PatientTable from "@/components/patient-table";
import ScheduleTable from "@/components/schedule-table";
import React from "react";

const Schedule = () => {
  return (
    <div>
      <div>
        <h1 className="font-[Inter] text-[28px] font-semibold leading-[33.6px] text-[#012970]">
          Kun Tartibi
        </h1>
        <p className="text-[16px] leading-[24px] text-[#6c757d] mt-[8px]">
          2025 M07 30, Wed
        </p>
      </div>

      <div className="mt-6 ">
        <ScheduleTable />
      </div>
    </div>
  );
};

export default Schedule;
