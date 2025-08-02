import { Calendar, LucideMessageCircleWarning, UserPlus2 } from "lucide-react";
import { FaRegCalendarCheck } from "react-icons/fa";
import AppointmentTable from "./dashboard-users-table";
import DashboardUserLastMessage from "./dashboard-user-latest-message";

const DashboardStatisticsNumbers = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <StatCard
          icon={<FaRegCalendarCheck className="w-[22px] h-[32px]" />}
          bgColor="bg-[#0C6DFD]"
          label="Bugungi uchrashuvlar"
          value="12 ta"
        />
        <StatCard
          icon={<UserPlus2 className="w-[22px] h-[32px]" />}
          bgColor="bg-[#198753]"
          label="Yangi bemorlar"
          value="8 ta"
        />
        <StatCard
          icon={<LucideMessageCircleWarning className="w-[22px] h-[32px]" />}
          bgColor="bg-[#FFC007]"
          label="Yangi xabarlar"
          value="5 ta"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 w-full">
        <div className="lg:col-span-8 col-span-12">
          <AppointmentTable />
        </div>
        <div className="lg:col-span-4 col-span-12">
          <DashboardUserLastMessage />
        </div>
      </div>
    </div>
  );
};

export default DashboardStatisticsNumbers;

// ✅ Statistik kartani komponentga ajratamiz
const StatCard = ({
  icon,
  bgColor,
  label,
  value,
}: {
  icon: React.ReactNode;
  bgColor: string;
  label: string;
  value: string;
}) => {
  return (
    <div className="shadow-md border border-gray-200 rounded-lg p-6 bg-white">
      <div className="flex items-center">
        <div
          className={`w-12 h-12 flex items-center justify-center text-white rounded-full mr-4 ${bgColor}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-[#6c757d] text-[15px] font-medium">{label}</p>
          <span className="text-[22px] font-bold text-[#212529]">{value}</span>
        </div>
      </div>
    </div>
  );
};
