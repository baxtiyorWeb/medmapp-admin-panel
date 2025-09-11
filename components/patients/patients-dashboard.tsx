"use client";

// import StatusCard from "./status-card";
import StatusCard from "./application/main-application-modal";
import Stepper from "./stepper";

export default function PatientsDashboard() {
  return (
    <div>
      <StatusCard />
      <Stepper />
      {/* <OrderedService /> */}
    </div>
  );
}
