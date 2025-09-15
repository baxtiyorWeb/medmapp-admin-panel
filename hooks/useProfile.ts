import api from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface PatientProfile {
  id: string;
  full_name: string;
  passport: string;
  dob: string;
  gender: string;
  phone: string;
  region: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Profilni olish
export const useProfile = () => {
  const fetchProfile = async (): Promise<PatientProfile> => {
    const response = await api.get("/patients/profile/me/");
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile_me"],
    queryFn: fetchProfile,
    staleTime: 30 * 60 * 1000,
  });

  return { profile: data, isLoading, isError };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<PatientProfile>) => {
      const response = await api.patch("/patients/profile/me/", data);
      return response.data;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["profile_me"], updatedProfile);
    },
  });
};
