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
  source: string;
  createdBy: string;
  history: PatientHistory[];
  details: {
    passport: string;
    dob: string;
    gender: string;
    phone: string;
    email: string;
    complaints: string;
    previousDiagnosis: string;
    documents: Document[];
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

export const initialPatients: Patient[] = [
    { 
      id: 1, name: 'Shohjahon Mirakov', tagId: 3, stageId: 'stage1',
      source: 'Facebook', createdBy: 'Operator #1',
      history: [ { date: '2025-08-11T11:35:00', author: 'Tizim', text: 'Bemor profili yaratildi.' } ],
      details: { 
          passport: 'AA1234567', dob: '1985-05-15', gender: 'Erkak', phone: '+998 90 123 45 67', email: 'shohjahon.m@gmail.com',
          complaints: 'Yurak sohasidagi og\'riq, hansirash.', previousDiagnosis: 'Gipertoniya',
          documents: [ {name: 'Pasport nusxasi.pdf', url: '#'}, {name: 'EKG natijasi.jpg', url: '#'} ]
      }
    },
    { 
      id: 2, name: 'Sarvinoz Karimova', tagId: 2, stageId: 'stage1',
      source: 'Sayt', createdBy: 'Admin',
      history: [ { date: '2025-08-10T11:35:00', author: 'Tizim', text: 'Bemor profili yaratildi.' } ],
      details: { 
          passport: 'AB7654321', dob: '1992-11-20', gender: 'Ayol', phone: '+998 91 234 56 78', email: 'sarvinoz.k@mail.com',
          complaints: 'Bosh og\'rig\'i, uyqusizlik.', previousDiagnosis: 'Migren',
          documents: []
      }
    },
    { 
      id: 3, name: 'John Doe', tagId: 1, stageId: 'stage2',
      source: 'Tavsiya', createdBy: 'Operator #1',
      history: [
          { date: '2025-08-02T10:00:00', author: 'Tizim', text: 'Bemor profili yaratildi.' },
          { date: '2025-08-04T11:35:00', author: 'Operator #1', text: 'Hujjatlar to\'liq yig\'ildi va klinikaga yuborishga tayyor.' }
      ],
      details: { 
          passport: 'US12345678', dob: '1978-01-30', gender: 'Erkak', phone: '+1-202-555-0149', email: 'j.doe@example.com',
          complaints: 'Umumiy holsizlik, vazn yo\'qotish.', previousDiagnosis: 'Kiritilmagan',
          documents: [ {name: 'Biopsy_results.pdf', url: '#'}, {name: 'PET-CT_scan.zip', url: '#'} ]
      }
    },
];