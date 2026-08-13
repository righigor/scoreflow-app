import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase/client";
import type { ClubType } from "@/types/club/club-type";

export function useGetMyClub() {
  const clubId = useAuthStore((state) => state.profile?.club_id);

  return useQuery({
    queryKey: ["club", clubId],
    queryFn: async () => {
      if (!clubId) throw new Error("Sem clube");
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", clubId)
        .single();
      if (error) throw new Error(error.message);
      return data as ClubType;
    },
    enabled: !!clubId,
  });
}
