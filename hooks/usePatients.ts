import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { get, isArray } from "lodash";

const usePatients = () => {
  const { data } = useQuery({
    queryKey: ["patients_operator"],
    queryFn: async () => await api.get("/patients/"),
  });

  const patientsItems = isArray(get(data, "data"))
    ? get(data, "data.results")
    : [];

  return { patientsItems };
};

export default usePatients;
