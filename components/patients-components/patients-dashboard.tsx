"use client";

import StatusCard from "./StatusCard";
import Stepper from "./Stepper";

export default function PatientsDashboard() {
  return (
    <div >
      <StatusCard />
      <Stepper />
      {/* <OrderedService /> */}
    </div>
  );
}
