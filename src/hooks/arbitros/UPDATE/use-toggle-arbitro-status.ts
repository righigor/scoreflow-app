import { createClient } from "@/lib/supabase/client";
import type { ArbitroType } from "@/types/arbitros/arbitro-type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const supabase = createClient();

export const useToggleArbitroStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 1. Recebe o novoStatus diretamente. Fim do problema do undefined!
    mutationFn: async ({ arbitroId, newStatus }: { arbitroId: string; newStatus: boolean }) => {
      const { error } = await supabase
        .from('judges')
        .update({ active: newStatus }) // Já recebe o valor final
        .eq('id', arbitroId);

      if (error) throw new Error(error.message);
    },

    onMutate: async ({ arbitroId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ["arbitros"] });
      const previousArbitros = queryClient.getQueryData<ArbitroType[]>(["arbitros"]);

      queryClient.setQueryData<ArbitroType[]>(["arbitros"], (old) =>
        old?.map((arb) =>
          arb.id === arbitroId ? { ...arb, active: newStatus } : arb
        ) ?? []
      );

      return { previousArbitros };
    },

    onError: (error, variables, context) => {
      if (context?.previousArbitros) {
        queryClient.setQueryData(["arbitros"], context.previousArbitros);
      }
      toast.error("Não foi possível alterar o status.", {
        description: error.message,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["arbitros"] });
    },
  });
};