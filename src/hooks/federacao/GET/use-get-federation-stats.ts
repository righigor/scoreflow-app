import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase/client";

export interface FederationStatsType {
  activeClubs: number;
  athletes: number;
  staff: number;
}

export function useGetFederationStats() {
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useQuery({
    queryKey: ["federation", "stats"],
    queryFn: async (): Promise<FederationStatsType> => {
      if (!federationId) return { activeClubs: 0, athletes: 0, staff: 0 };

      const [clubsRes, athRes, staffRes] = await Promise.all([
        supabase
          .from("clubs")
          .select("*", { count: "exact", head: true })
          .eq("status", "ACTIVE"), // Só ativos
        supabase.from("athletes").select("*", { count: "exact", head: true }),
        supabase.from("staff").select("*", { count: "exact", head: true }),
      ]);

      if (clubsRes.error) throw new Error(clubsRes.error.message);
      if (athRes.error) throw new Error(athRes.error.message);
      if (staffRes.error) throw new Error(staffRes.error.message);

      return {
        activeClubs: clubsRes.count ?? 0,
        athletes: athRes.count ?? 0,
        staff: staffRes.count ?? 0,
      };
    },
    enabled: !!federationId,
  });
}
