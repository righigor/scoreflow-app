import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase/client";
import type { ClubType } from "@/types/club/club-type";

export function useGetPendingClubs() {
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useQuery({
    queryKey: ["federation", "clubs", "pending"],
    queryFn: async () => {
      if (!federationId) throw new Error("Sem federação");
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("federation_id", federationId)
        .eq("status", "PENDING")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data as ClubType[];
    },
    enabled: !!federationId,
  });
}
