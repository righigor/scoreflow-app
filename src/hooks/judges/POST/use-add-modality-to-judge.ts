import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export function useAddModalityToJudge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ judgeId, modalityId }: { judgeId: string; modalityId: string }) => {
      const { error } = await supabase
        .from("judge_modalities")
        .insert({ judge_id, modality_id });

      if (error) throw new Error(error.message);
    },
    onSuccess: (_, { judgeId }) => {
      queryClient.invalidateQueries({ queryKey: ["judge_modalities", judgeId] });
      toast.success("Modalidade adicionada ao juiz.");
    },
    onError: (error) =>
      toast.error("Erro ao adicionar modalidade", { description: error.message }),
  });
}