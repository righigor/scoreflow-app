import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export function useGetCategoriesByModality(modalityId: string | null) {
  return useQuery({
    queryKey: ["base_categories", modalityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("base_categories")
        .select("*")
        .eq("modality_id", modalityId)
        .order("name");

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!modalityId,
  });
}