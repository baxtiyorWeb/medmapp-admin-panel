import api from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

// TypeScript interfeysi
export interface PatientProfile {
  id: string;
  full_name: string;
  passport: string;
  dob: string;
  gender: string;
  phone: string;
  region: string;
  email: string;
  avatar_url: string; // Sizning interfeysingizdagi maydon nomi
  created_at: string;
  updated_at: string;
}

// ----------------------------------------------------------------
// ## Profil ma'lumotlarini olish uchun hook
// ----------------------------------------------------------------
export const useProfile = () => {
  const fetchProfile = async (): Promise<PatientProfile> => {
    const response = await api.get("/patients/me/");
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
      return response.data;
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

  return useMutation<PatientProfile, AxiosError, File>({
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
      return data;
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
