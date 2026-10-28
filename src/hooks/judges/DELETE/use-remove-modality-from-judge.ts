import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export function useRemoveModalityFromJudge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ judgeId, modalityId }: { judgeId: string; modalityId: string }) => {
      const { error } = await supabase
        .from("judge_modalities")
        .delete()
        .eq("judge_id", judgeId)
        .eq("modality_id", modalityId);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_, { judgeId }) => {
      queryClient.invalidateQueries({ queryKey: ["judge_modalities", judgeId] });
      toast.success("Modalidade removida do juiz.");
    },
    onError: (error) =>
      toast.error("Erro ao remover modalidade", { description: error.message }),
  });
}