import api from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

// TypeScript interfeysi
export interface PatientDocument {
  id: string;
  file: string;
  description: string;
  uploaded_by: {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    role: string;
    phone_number: string;
  };
  uploaded_at: string;
  source_type: string;
  source_type_display: string;
}

export interface PatientHistory {
  id: string;
  author: {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    role: string;
    phone_number: string;
  };
  comment: string;
  created_at: string;
}

export interface Patient {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  source: string;
  stage_title?: string;
  tag_name?: string;
  tag_color?: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
  region?: string
}

export interface PatientProfile {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    role: string;
    phone_number: string;
  };
  phone: string,
  passport: string | null;
  dob: string | null;
  gender: string;
  complaints: string;
  previous_diagnosis: string;
  patient: Patient | null;
  documents: PatientDocument[];
  history: PatientHistory[];
}

// ----------------------------------------------------------------
// ## Profil ma'lumotlarini olish uchun hook
// ----------------------------------------------------------------
export const useProfile = () => {
  const fetchProfile = async (): Promise<PatientProfile> => {
    const response = await api.get("/patients/me/");
    return response.data?.patient;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile_me"], // Sizning kodingizdagi queryKey
    queryFn: fetchProfile,
    staleTime: 30 * 60 * 1000, // 30 daqiqa
  });


  return { profile: data, isLoading, isError };
};
export const useOperatorProfile = () => {
  const fetchProfile = async (): Promise<PatientProfile> => {
    const response = await api.get("/patients/operators/me/");
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile_me"], // Sizning kodingizdagi queryKey
    queryFn: fetchProfile,
    staleTime: 30 * 60 * 1000, // 30 daqiqa
  });


  return { profile: data, isLoading, isError };
};




// ----------------------------------------------------------------
// ## Profil ma'lumotlarini yangilash uchun hook (PATCH)
// ----------------------------------------------------------------
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<PatientProfile, AxiosError, Partial<PatientProfile>>({
    mutationFn: async (data: Partial<PatientProfile>) => {
      const response = await api.patch("/patients/me/", data);
      return response.data?.patient;
    },
    onSuccess: (updatedProfile) => {
      // Muvaffaqiyatli javobdan so'ng keshni darhol yangilash
      queryClient.setQueryData(["profile_me"], updatedProfile);
    },
  });
};

// ----------------------------------------------------------------
// ## 🖼️ Avatar yuklash uchun hook (YANGI)
// ----------------------------------------------------------------
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarFile: File) => {
      const formData = new FormData();
      // Backendda faylni qabul qiladigan maydon nomi odatda 'avatar' bo'ladi
      formData.append("avatar", avatarFile);

      // Endpointni backend logikasiga mos ravishda taxmin qilamiz
      const { data } = await api.patch<PatientProfile>(
        "/patients/me/avatar/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { ...data.patient };
    },
    onSuccess: (updatedProfile) => {
      // Rasm yuklangach, keshdagi profil ma'lumotlarini yangi ma'lumot bilan almashtiramiz.
      // Bu sahifani qayta yuklamasdan avatarni darhol ko'rsatish imkonini beradi.
      queryClient.setQueryData(["profile_me"], updatedProfile);
    },
  });
};

// ----------------------------------------------------------------
// ## 🗑️ Avatarni o'chirish uchun hook (YANGI)
// ----------------------------------------------------------------
export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError>({
    mutationFn: async () => {
      // Endpointni backend logikasiga mos ravishda taxmin qilamiz
      await api.delete("/patients/me/avatar/");
    },
    onSuccess: () => {
      // Avatar o'chirilgandan so'ng, profil ma'lumotlarini serverdan qayta so'rab olish uchun
      // keshni "eskirgan" deb belgilaymiz.
      queryClient.invalidateQueries({ queryKey: ["profile_me"] });
    },
  });
};
