import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export function useGetApparatusByModality(modalityId: string | null) {
  return useQuery({
    queryKey: ["apparatus", modalityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apparatus")
        .select("*")
        .eq("modality_id", modalityId)
        .order("name");

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!modalityId,
  });
}