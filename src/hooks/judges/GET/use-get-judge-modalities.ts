import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import type { ModalityType } from "@/types/modality/modality-type";

export function useGetJudgeModalities(judgeId: string | null) {
  return useQuery({
    queryKey: ["judge_modalities", judgeId],
    queryFn: async (): Promise<ModalityType[]> => {
      if (!judgeId) return [];

      const { data, error } = await supabase
        .from("judge_modalities")
        .select("modalities(*)")
        .eq("judge_id", judgeId);

      if (error) throw new Error(error.message);

      return (
        (data as unknown as { modalities: ModalityType }[]).map(
          (item) => item.modalities,
        ) ?? []
      );
    },
    enabled: !!judgeId,
  });
}