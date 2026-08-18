import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import type { AthleteWithModalitiesType } from "@/types/athlete/athlete-type";
import { supabase } from "@/lib/supabase/client";

export function useGetAthletesByClubId() {
  const clubId = useAuthStore((state) => state.profile?.club_id);

  return useQuery({
    queryKey: ["athletes", "by_club", clubId],
    queryFn: async () => {
      if (!clubId) return [];

      const { data, error } = await supabase
        .from("athletes")
        .select("*, athlete_modalities(modality_id)")
        .eq("club_id", clubId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      return data as AthleteWithModalitiesType[];
    },
    enabled: !!clubId,
  });
}
