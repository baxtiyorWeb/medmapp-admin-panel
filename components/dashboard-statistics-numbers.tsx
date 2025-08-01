import { Calendar, LucideMessageCircleWarning, UserPlus2 } from "lucide-react";
import React from "react";
import { FaRegCalendarCheck } from "react-icons/fa";
import AppointmentTable from "./dashboard-users-table";
import DashboardUserLastMessage from "./dashboard-user-latest-message";

const DashboardStatisticsNumbers = () => {
  return (
    <>
      <div className="grid grid-cols-3 gap-[24px]">
        <div className="shadow-md mt-[24px] border border-gray-500/10 rounded-lg px-[24px] py-[28px]">
          <div className="flex">
            <div className="w-[48px] h-[48px] flex text-white justify-center items-center rounded-full mr-4 bg-[#0C6DFD] ">
              <FaRegCalendarCheck className="w-[22px] h-[32px]" />
            </div>
            <div>
              <p className="text-[#6c757d] text-[16px] font-medium leading-[19.2px]  ">
                Bugungi uchrashuvlar
              </p>
              <span className="text-[24px] font-bold  text-[#212529] leading-[28.8px]">
                12 ta{" "}
              </span>
            </div>
          </div>
        </div>
        <div className="shadow-md mt-[24px] border border-gray-500/10 rounded-lg px-[24px] py-[28px]">
          <div className="flex">
            <div className="w-[48px] h-[48px] flex text-white justify-center items-center rounded-full mr-4 bg-[#198753] ">
              <UserPlus2 className="w-[22px] h-[32px]" />
            </div>
            <div>
              <p className="text-[#6c757d] text-[16px] font-medium leading-[19.2px]  ">
                Bugungi uchrashuvlar
              </p>
              <span className="text-[24px] font-bold  text-[#212529] leading-[28.8px]">
                12 ta{" "}
              </span>
            </div>
          </div>
        </div>
        <div className="shadow-md mt-[24px] border border-gray-500/10 rounded-lg px-[24px] py-[28px]">
          <div className="flex">
            <div className="w-[48px] h-[48px] flex text-white justify-center items-center rounded-full mr-4 bg-[#FFC007] ">
              <LucideMessageCircleWarning className="w-[22px] h-[32px]" />
            </div>
            <div>
              <p className="text-[#6c757d] text-[16px] font-medium leading-[19.2px]  ">
                Bugungi uchrashuvlar
              </p>
              <span className="text-[24px] font-bold  text-[#212529] leading-[28.8px]">
                12 ta{" "}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 mt-6 col-span-12  w-full h-full gap-4">
        <div className="col-span-8">
          <AppointmentTable />
        </div>
        <div className="col-span-4">
          <DashboardUserLastMessage />
        </div>
      </div>
    </>
  );
};

export default DashboardStatisticsNumbers;
