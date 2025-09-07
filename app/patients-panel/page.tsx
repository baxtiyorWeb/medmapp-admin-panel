import PatientsDashboard from "@/components/patients/patients-dashboard";
import ServiceCard from "@/components/patients/service-card";
import React from "react";

const PatientDashboardHomePage = () => {

  return (
    <div>
      <div className="container">
        <PatientsDashboard />
        <ServiceCard />
      </div>
    </div>
  );
};

export default PatientDashboardHomePage;
