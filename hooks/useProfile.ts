import api from "@/utils/api";
import { useCallback } from "react";

const useProfile = () => {
  const fetchProfile = useCallback(async () => {
    try {
      const response = await api.get("/patients/profile/me/");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return {};
    }
  }, []);
  return { fetchProfile };
};

export default useProfile;
