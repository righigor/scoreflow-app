import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { ArbitroType } from "@/types/arbitros/arbitro-type";

export function useGetArbitros() {
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useQuery({
    queryKey: ["arbitros", federationId],
    queryFn: async (): Promise<ArbitroType[]> => {
      if (!federationId) throw new Error("Sem federação");

      const { data, error } = await supabase
        .from("judges")
        .select("*, judge_modalities(modality_id)")
        .eq("federation_id", federationId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return (data ?? []) as ArbitroType[];
    },
    enabled: !!federationId,
  });
}