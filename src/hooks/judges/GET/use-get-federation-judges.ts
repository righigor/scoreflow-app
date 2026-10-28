import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase/client";
import type { JudgeSimpleType } from "@/types/championship/championship-type";
import type { ModalityIdArrayType } from "@/types/modality/modality-type";

type JudgeRaw = {
  id: string;
  name: string;
  brevet: string;
  judge_modalities: ModalityIdArrayType | null;
};

export function useGetFederationJudges(
  search?: string,
  modalityId?: string | null,
) {
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useQuery({
    queryKey: ["federation_judges", federationId, search, modalityId],
    queryFn: async (): Promise<JudgeSimpleType[]> => {
      if (!federationId) return [];

      let query = supabase
        .from("judges")
        .select("id, name, brevet, judge_modalities(modality_id)")
        .eq("federation_id", federationId)
        .eq("active", true)
        .order("name");

      if (search && search.trim()) {
        query = query.ilike("name", `%${search.trim()}%`);
      }

      if (modalityId) {
        query = query.eq("judge_modalities.modality_id", modalityId);
      }

      const { data, error } = await query;
      if (error) throw new Error(error.message);

      return (
        (data as unknown as JudgeRaw[])?.map((judge) => ({
          id: judge.id,
          name: judge.name,
          brevet: judge.brevet as JudgeSimpleType["brevet"],
          judge_modalities: judge.judge_modalities ?? [],
        })) ?? []
      );
    },
    enabled: !!federationId,
  });
}