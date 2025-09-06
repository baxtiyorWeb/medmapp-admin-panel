import PatientsDashboard from "@/components/patients-components/patients-dashboard";
import ServiceCard from "@/components/patients-components/ServiceCard";
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
