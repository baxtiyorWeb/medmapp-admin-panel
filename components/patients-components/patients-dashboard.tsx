"use client";

import OrderedService from "./OrderedService";
import ServiceCard from "./ServiceCard";
import StatusCard from "./StatusCard";
import Stepper from "./Stepper";
import "./style.css";
export default function PatientsDashboard() {
  return (
    <div>
      <div className="container">
        <StatusCard />
        <Stepper />
        <ServiceCard />
        <OrderedService />
      </div>
    </div>
  );
}
