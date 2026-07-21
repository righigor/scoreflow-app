import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { ArbitroType } from "@/types/arbitros/arbitro-type";

const supabase = createClient();

export function useGetArbitros() {
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useQuery({
    queryKey: ["arbitros", federationId],
    queryFn: async () => {
      if (!federationId) throw new Error("Sem federação");

      const { data, error } = await supabase
        .from("judges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as ArbitroType[];
    },
    enabled: !!federationId,
  });
}
