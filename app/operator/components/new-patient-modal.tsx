"use client";

import { useState } from "react";

interface Patient {
  id: number;
  name: string;
  tagId: number;
  stageId: string;
  source: string;
  createdBy: string;
  history: { date: string; author: string; text: string }[];
  details: {
    passport: string;
    dob: string;
    gender: string;
    phone: string;
    email: string;
    complaints: string;
    previousDiagnosis: string;
    documents: { name: string; url: string }[];
  };
}

interface NewPatientModalProps {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  tags: { id: number; text: string; color: string }[];
}

export default function NewPatientModal({
  patients,
  setPatients,
  tags,
}: NewPatientModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const totalSteps = 3;

  const updateWizardControls = () => {
    const progressBar = document.querySelector(
      ".wizard-progress-bar"
    ) as HTMLElement;
    if (progressBar) {
      progressBar.style.width = `${
        ((currentStep - 1) / (totalSteps - 1)) * 100
      }%`;
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    updateWizardControls();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = (
      document.getElementById("new-patient-name") as HTMLInputElement
    ).value;
    const phone = (
      document.getElementById("new-patient-phone") as HTMLInputElement
    ).value;
    if (!name || !phone) {
      // Show toast (handled in parent)
      goToStep(1);
      return;
    }
    if (
      !(document.getElementById("form-agreement") as HTMLInputElement).checked
    ) {
      // Show toast
      return;
    }
    const operatorName = "Operator #1";
    const newPatient: Patient = {
      id: patients.length > 0 ? Math.max(...patients.map((p) => p.id)) + 1 : 1,
      name,
      tagId: 1,
      stageId: "stage1",
      source: operatorName,
      createdBy: operatorName,
      history: [
        {
          date: new Date().toISOString(),
          author: operatorName,
          text: "Bemor profili anketa orqali yaratildi.",
        },
      ],
      details: {
        passport:
          (document.getElementById("new-patient-passport") as HTMLInputElement)
            .value || "-",
        dob:
          (document.getElementById("new-patient-dob") as HTMLInputElement)
            .value || "-",
        gender:
          (document.getElementById("new-patient-gender") as HTMLSelectElement)
            .value || "-",
        phone,
        email:
          (document.getElementById("new-patient-email") as HTMLInputElement)
            .value || "-",
        complaints:
          (
            document.getElementById(
              "new-patient-complaints"
            ) as HTMLTextAreaElement
          ).value || "Kiritilmagan",
        previousDiagnosis:
          (document.getElementById("new-patient-diagnosis") as HTMLInputElement)
            .value || "Kiritilmagan",
        documents: files.map((f) => ({ name: f.name, url: "#" })),
      },
    };
    setPatients([newPatient, ...patients]);
    setFiles([]);
    setCurrentStep(1);
    // Hide modal (handled in parent)
  };

  return (
    <div className="modal fade" id="newPatientModal">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Konsultatsiya uchun Anketa</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <div className="wizard-progress">
              <div className="wizard-progress-bar"></div>
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`wizard-progress-step ${
                    currentStep === step ? "active" : ""
                  }`}
                  data-step={step}
                >
                  <div className="step-icon">{step}</div>
                  <div className="step-label">
                    {["Shaxsiy", "Tibbiy", "Hujjatlar"][step - 1]}
                  </div>
                </div>
              ))}
            </div>
            <form id="new-patient-form" onSubmit={handleSubmit}>
              <div
                className={`wizard-step ${currentStep === 1 ? "active" : ""}`}
                id="step-1"
              >
                <h6 className="mb-3">Shaxsiy ma&apos;lumotlar</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label">Ism-familiya</label>
                    <input
                      type="text"
                      id="new-patient-name"
                      className="form-control"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Pasport</label>
                    <input
                      type="text"
                      id="new-patient-passport"
                      className="form-control"
                    />
                  </div>
                  <div>
                    <label className="form-label">Tug&apos;ilgan sana</label>
                    <input
                      type="date"
                      id="new-patient-dob"
                      className="form-control"
                    />
                  </div>
                  <div>
                    <label className="form-label">Jins</label>
                    <select id="new-patient-gender" className="form-select">
                      <option selected>Tanlang...</option>
                      <option value="Erkak">Erkak</option>
                      <option value="Ayol">Ayol</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Telefon</label>
                    <input
                      type="tel"
                      id="new-patient-phone"
                      className="form-control"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Pochta</label>
                    <input
                      type="email"
                      id="new-patient-email"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div
                className={`wizard-step ${currentStep === 2 ? "active" : ""}`}
                id="step-2"
              >
                <h6 className="mb-3">Tibbiy ma&apos;lumotlar</h6>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="form-label">Shikoyatlar</label>
                    <textarea
                      id="new-patient-complaints"
                      className="form-control"
                      rows={4}
                    ></textarea>
                  </div>
                  <div>
                    <label className="form-label">Avvalgi tashxis</label>
                    <input
                      type="text"
                      id="new-patient-diagnosis"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div
                className={`wizard-step ${currentStep === 3 ? "active" : ""}`}
                id="step-3"
              >
                <h6 className="mb-3">Hujjatlarni yuklash</h6>
                <input
                  className="form-control"
                  type="file"
                  id="new-patient-files"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
                <div id="new-patient-file-list" className="mt-2">
                  {files.map((file) => (
                    <div key={file.name} className="file-item">
                      <span>{file.name}</span>
                      <span>({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ))}
                </div>
                <div className="form-check mt-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="form-agreement"
                    required
                  />
                  <label className="form-check-label" htmlFor="form-agreement">
                    Men kiritgan barcha ma&apos;lumotlarning
                    to&apos;g&apos;riligini tasdiqlayman hamda{" "}
                    <a href="#">Ommaviy oferta</a> va{" "}
                    <a href="#">Foydalanish shartlari</a> bilan tanishib
                    chiqdim.
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-light"
              style={{ display: currentStep === 1 ? "none" : "inline-block" }}
              onClick={() => goToStep(currentStep - 1)}
            >
              Orqaga
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                currentStep < totalSteps
                  ? goToStep(currentStep + 1)
                  : handleSubmit(new Event("submit"))
              }
            >
              {currentStep === totalSteps
                ? "Tasdiqlash va Yuborish"
                : "Keyingisi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
