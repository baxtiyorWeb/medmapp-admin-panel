import PatientsDashboard from "@/components/patients/patients-dashboard";
import ServiceCard from "@/components/patients/service-card";
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
