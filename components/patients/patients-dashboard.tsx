"use client";

import StatusCard from "./status-card";
import Stepper from "./stepper-section";

export default function PatientsDashboard() {
  return (
    <div>
      <div className="container">
        <StatusCard />
        <Stepper />
        {/* <OrderedService /> */}
      </div>
    </div>
  );
}
