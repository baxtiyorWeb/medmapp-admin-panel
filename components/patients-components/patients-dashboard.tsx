"use client";

import StatusCard from "./StatusCard";
import Stepper from "./Stepper";

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
