export interface Document {
  name: string;
  url: string;
}

export interface PatientHistory {
  date: string;
  author: string;
  text: string;
}

export interface Patient {
  id: number;
  name: string;
  tagId: number;
  stageId: string;
  phone: string;
  source: string;
  createdBy: string;
  lastUpdatedAt: string;
  history: PatientHistory[];
  details: {
    passport: string;
    dob: string;
    gender: string;
    phone: string;
    email: string;
    complaints: string;
    previousDiagnosis: string;
    documents: unknown;
  };
}

export interface Stage {
  id: string;
  title: string;
  colorClass: string;
}

export interface Tag {
  id: number;
  text: string;
  color: string;
}

export const initialStages: Stage[] = [
  { id: 'stage1', title: 'Yangi', colorClass: 'kanban-column-new' },
  { id: 'stage2', title: 'Hujjatlar', colorClass: 'kanban-column-docs' },
  { id: 'stage3', title: "To'lov", colorClass: 'kanban-column-payment' },
  { id: 'stage4', title: 'Safar', colorClass: 'kanban-column-trip' },
  { id: 'stage5', title: 'Arxiv', colorClass: 'kanban-column-archive' }
];

export const initialTags: Tag[] = [
  { id: 1, text: 'Normal', color: 'success' },
  { id: 2, text: 'VIP', color: 'warning' },
  { id: 3, text: 'Shoshilinch', color: 'danger' },
];

