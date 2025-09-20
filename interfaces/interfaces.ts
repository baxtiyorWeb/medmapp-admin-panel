export interface SidebarItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  text: string;
  open: boolean;
  className?: string;
  active?: boolean;
  link?: string;
  onClick: () => void;
}


// TypeScript interfeysi - API javobiga moslashtirilgan
export interface PatientProfile {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    role: string;
    phone_number: string;
  };
  passport: string | null;
  dob: string | null;
  gender: string;
  complaints: string;
  previous_diagnosis: string;
  patient: any | null;
  documents: any | null;
  history: any | null;
  region: string,
  avatar_url: string
}

// Profil ma'lumotlarini komponent uchun tayyorlash
export interface ProfileFormData {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
  phone: string;
  passport: string | null;
  region: string;
  gender: string;
  avatar_url: string | null;
  dob: string | null;
}