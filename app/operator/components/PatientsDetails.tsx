'use client';

import { useState } from 'react';

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

interface Tag {
  id: number;
  text: string;
  color: string;
}

interface PatientDetailsProps {
  patientId: number | null;
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
  tags: Tag[];
}

export default function PatientDetails({ patientId, patients, setPatients, tags }: PatientDetailsProps) {
  const [editMode, setEditMode] = useState<string | null>(null);
  const patient = patients.find((p) => p.id === patientId);
  const currentOperator = 'Operator #1'; // Simulating operator name

  if (!patient) return null;

  const canEdit = patient.createdBy === currentOperator || currentOperator === 'Admin';
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const time = date.toTimeString().slice(0, 5);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${time} | ${day}.${month}.${year}`;
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedPatients = patients.map((p) =>
      p.id === patient.id ? { ...p, tagId: parseInt(e.target.value) } : p
    );
    setPatients(updatedPatients);
    // Show toast (handled in parent component)
  };

  const toggleEditMode = (cardType: string) => {
    setEditMode(editMode === cardType ? null : cardType);
  };

  const saveDetails = (cardType: string) => {
    const updatedPatients = patients.map((p) => {
      if (p.id !== patient.id) return p;
      if (cardType === 'personal') {
        return {
          ...p,
          details: {
            ...p.details,
            passport: (document.getElementById('edit-passport') as HTMLInputElement).value,
            dob: (document.getElementById('edit-dob') as HTMLInputElement).value,
            gender: (document.getElementById('edit-gender') as HTMLSelectElement).value,
            phone: (document.getElementById('edit-phone') as HTMLInputElement).value,
            email: (document.getElementById('edit-email') as HTMLInputElement).value,
          },
        };
      } else if (cardType === 'medical') {
        return {
          ...p,
          details: {
            ...p.details,
            complaints: (document.getElementById('edit-complaints') as HTMLInputElement).value,
            previousDiagnosis: (document.getElementById('edit-diagnosis') as HTMLInputElement).value,
          },
        };
      }
      return p;
    });
    setPatients(updatedPatients);
    setEditMode(null);
  };

  return (
    <div className="offcanvas offcanvas-end offcanvas-details show" id="patientDetailsOffcanvas" style={{ width: '600px' }}>
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">{patient.name}</h5>
        <button type="button" className="btn-close" onClick={() => setSelectedPatientId(null)}></button>
      </div>
      <div className="offcanvas-body">
        <div className="details-card">
          <div className="details-card-header">
            <h6><i className="bi bi-person-badge mr-2"></i>Shaxsiy ma'lumotlar</h6>
            <div id="personal-edit-controls">
              <button
                className="btn btn-sm btn-outline-primary border-0"
                onClick={() => toggleEditMode('personal')}
                disabled={!canEdit}
              >
                <i className="bi bi-pencil"></i> Tahrirlash
              </button>
            </div>
          </div>
          <div className="details-card-body" id="personal-details-body">
            {editMode === 'personal' ? (
              <>
                <div className="details-info-item">
                  <span className="label">Pasport</span>
                  <input type="text" className="form-control form-control-sm" id="edit-passport" defaultValue={patient.details.passport} />
                </div>
                <div className="details-info-item">
                  <span className="label">Tug'ilgan sana</span>
                  <input type="date" className="form-control form-control-sm" id="edit-dob" defaultValue={patient.details.dob} />
                </div>
                <div className="details-info-item">
                  <span className="label">Jins</span>
                  <select className="form-select form-select-sm" id="edit-gender" defaultValue={patient.details.gender}>
                    <option value="Erkak">Erkak</option>
                    <option value="Ayol">Ayol</option>
                  </select>
                </div>
                <div className="details-info-item">
                  <span className="label">Telefon</span>
                  <input type="tel" className="form-control form-control-sm" id="edit-phone" defaultValue={patient.details.phone} />
                </div>
                <div className="details-info-item">
                  <span className="label">Pochta</span>
                  <input type="email" className="form-control form-control-sm" id="edit-email" defaultValue={patient.details.email} />
                </div>
                <div className="mt-2">
                  <button className="btn btn-sm btn-success border-0" onClick={() => saveDetails('personal')}>
                    <i className="bi bi-check-lg"></i> Saqlash
                  </button>
                  <button className="btn btn-sm btn-light border-0" onClick={() => setEditMode(null)}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="details-info-item"><span className="label">Pasport</span><span className="value">{patient.details.passport}</span></div>
                <div className="details-info-item"><span className="label">Tug'ilgan sana</span><span className="value">{patient.details.dob}</span></div>
                <div className="details-info-item"><span className="label">Jins</span><span className="value">{patient.details.gender}</span></div>
                <div className="details-info-item"><span className="label">Telefon</span><span className="value">{patient.details.phone}</span></div>
                <div className="details-info-item"><span className="label">Pochta</span><span className="value">{patient.details.email}</span></div>
              </>
            )}
          </div>
        </div>
        <div className="details-card">
          <div className="details-card-header">
            <h6><i className="bi bi-heart-pulse mr-2"></i>Tibbiy ma'lumotlar</h6>
            <div id="medical-edit-controls">
              <button
                className="btn btn-sm btn-outline-primary border-0"
                onClick={() => toggleEditMode('medical')}
                disabled={!canEdit}
              >
                <i className="bi bi-pencil"></i> Tahrirlash
              </button>
            </div>
          </div>
          <div className="details-card-body" id="medical-details-body">
            {editMode === 'medical' ? (
              <>
                <div className="details-info-item">
                  <span className="label">Shikoyatlar</span>
                  <input type="text" className="form-control form-control-sm" id="edit-complaints" defaultValue={patient.details.complaints} />
                </div>
                <div className="details-info-item">
                  <span className="label">Avvalgi tashxis</span>
                  <input type="text" className="form-control form-control-sm" id="edit-diagnosis" defaultValue={patient.details.previousDiagnosis} />
                </div>
                <div className="mt-2">
                  <button className="btn btn-sm btn-success border-0" onClick={() => saveDetails('medical')}>
                    <i className="bi bi-check-lg"></i> Saqlash
                  </button>
                  <button className="btn btn-sm btn-light border-0" onClick={() => setEditMode(null)}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="details-info-item"><span className="label">Shikoyatlar</span><span className="value">{patient.details.complaints}</span></div>
                <div className="details-info-item"><span className="label">Avvalgi tashxis</span><span className="value">{patient.details.previousDiagnosis}</span></div>
              </>
            )}
          </div>
        </div>
        <div className="details-card">
          <div className="details-card-header"><h6><i className="bi bi-file-earmark-arrow-up mr-2"></i>Yuklangan hujjatlar</h6></div>
          <div className="details-card-body">
            {patient.details.documents.length > 0 ? (
              patient.details.documents.map((doc) => (
                <div key={doc.name} className="document-list-item">
                  <a href={doc.url} target="_blank"><i className="bi bi-file-earmark-text mr-2"></i>{doc.name}</a>
                  <button className="btn btn-sm btn-outline-danger border-0" disabled={!canEdit}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted">Hujjatlar yuklanmagan.</p>
            )}
          </div>
        </div>
        <div className="details-card">
          <div className="details-card-header"><h6><i className="bi bi-tag mr-2"></i>Holat</h6></div>
          <div className="details-card-body">
            <select
              className="form-select"
              value={patient.tagId}
              onChange={handleTagChange}
              disabled={!canEdit}
            >
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>{tag.text}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="details-card">
          <div className="details-card-header"><h6><i className="bi bi-clock-history mr-2"></i>Tarix va Izohlar</h6></div>
          <div className="details-card-body">
            {patient.history.slice().reverse().map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="font-bold">{item.text}</div>
                <div className="text-xs text-muted">{item.author} - {formatDate(item.date)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <button
            className="btn btn-outline-danger w-full"
            data-bs-toggle="modal"
            data-bs-target="#deleteConfirmModal"
            disabled={!canEdit}
          >
            <i className="bi bi-trash mr-2"></i>Bemorni o'chirish
          </button>
        </div>
      </div>
    </div>
  );
}