import { supabase } from "@/lib/supabase/client";
import type { FederationType } from "@/types/federacao/federacao-type";
import { useQuery } from "@tanstack/react-query";

export function useGetFederations() {
  return useQuery({
    queryKey: ["admin", "federations"],
    queryFn: async (): Promise<FederationType[]> => {
      const { data, error } = await supabase
        .from("federations")
        .select("*")
        .order("name");

      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}
