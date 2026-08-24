import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase/client";
import type { ClubWithModalitiesType } from "@/types/club/club-type";

export function useGetFederationClubs() {
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useQuery({
    queryKey: ["federation", "clubs"],
    queryFn: async () => {
      if (!federationId) throw new Error("Sem federação");

      const { data, error } = await supabase
        .from("clubs")
        .select("*, club_modalities(modality_id)")
        .eq("federation_id", federationId)
        .in("status", ["ACTIVE", "INACTIVE"])
        .order("name");

      if (error) throw new Error(error.message);
      return data as ClubWithModalitiesType[];
    },
    enabled: !!federationId,
  });
}