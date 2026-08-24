import { supabase } from "@/lib/supabase/client";
import type { ModalityType } from "@/types/modality/modality-type";
import { useQuery } from "@tanstack/react-query";

export function useGetModalities() {
  return useQuery({
    queryKey: ["modalities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modalities")
        .select("*")
        .order("name");
      if (error) throw new Error(error.message);
      return data as ModalityType[];
    },
  });
}
