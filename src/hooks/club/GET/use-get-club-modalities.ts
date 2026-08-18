import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase/client";

type ClubModalityRaw = {
  modality_id: string;
  modalities: {
    name: string;
  } | null;
};

type ClubModalityFormatted = {
  modality_id: string;
  name: string;
};

export function useGetClubModalities() {
  const clubId = useAuthStore((state) => state.profile?.club_id);

  return useQuery({
    queryKey: ["club_modalities", clubId],
    // 3. Garantimos o tipo de retorno da promise
    queryFn: async (): Promise<ClubModalityFormatted[]> => {
      if (!clubId) return [];

      const { data, error } = await supabase
        .from("club_modalities")
        .select("modality_id, modalities(name)")
        .eq("club_id", clubId);

      if (error) throw new Error(error.message);

      // 4. Fazemos o cast seguro usando a nossa tipagem crua, e usamos o ?? para o fallback
      return (data as unknown as ClubModalityRaw[])?.map((item) => ({
        modality_id: item.modality_id,
        name: item.modalities?.name ?? "Desconhecida",
      })) ?? [];
    },
    enabled: !!clubId,
  });
}