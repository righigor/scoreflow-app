import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { AthleteWithModalitiesType } from "@/types/athlete/athlete-type";

export function useGetAthleteById(athleteId: string) {
  return useQuery({
    queryKey: ["athlete", athleteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("athletes")
        .select("*, athlete_modalities(modality_id)")
        .eq("id", athleteId)
        .single();

      if (error) throw new Error(error.message);

      return data as AthleteWithModalitiesType;
    },
    enabled: !!athleteId,
  });
}