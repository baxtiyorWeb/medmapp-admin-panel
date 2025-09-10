import PatientsDashboard from "@/components/patients-components/patients-dashboard";
import ServiceCard from "@/components/patients-components/ServiceCard";
import React from "react";

const PatientDashboardHomePage = () => {

  return (
      <div className="w-full">
        <PatientsDashboard />
        <ServiceCard />
      </div>
  );
};

export default PatientDashboardHomePage;
