import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { FederacaoType } from "@/types/federacao/federacao-type";

const supabase = createClient();

export function useGetFederacaoProfile() {
  const profile = useAuthStore((state) => state.profile);

  return useQuery({
    queryKey: ["federacao", profile?.federation_id],
    queryFn: async () => {
      if (!profile?.federation_id) {
        throw new Error("Usuário não pertence a uma federação.");
      }

      const { data, error } = await supabase
        .from("federations")
        .select("*")
        .eq("id", profile.federation_id)
        .single();

      if (error) throw new Error(error.message);
      return data as FederacaoType;
    },
    enabled: !!profile?.federation_id,
  });
}
