import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { ApparatusType } from "@/types/apparatus/apparatus-type";

export function useGetApparatus() {
  return useQuery({
    queryKey: ["apparatus"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apparatus")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw new Error(error.message);
      return data as ApparatusType[];
    },
  });
}
