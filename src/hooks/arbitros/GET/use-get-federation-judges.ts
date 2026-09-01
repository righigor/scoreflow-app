import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase/client";
import type { JudgeSimpleType } from "@/types/championship/championship-type";

export function useGetFederationJudges(search: string) {
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useQuery({
    queryKey: ["federation_judges", federationId, search],
    queryFn: async (): Promise<JudgeSimpleType[]> => {
      if (!federationId) return [];

      let query = supabase
        .from("judges")
        .select("id, name, brevet")
        .eq("federation_id", federationId)
        .eq("active", true)
        .order("name");

      if (search.trim()) {
        query = query.ilike("name", `%${search.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data ?? []) as JudgeSimpleType[];
    },
    enabled: !!federationId,
  });
}
