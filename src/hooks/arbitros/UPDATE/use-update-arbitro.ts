import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { UpdateArbitroSchemaType } from "@/zod/arbitro/update-arbitro-schema";


const supabase = createClient();

export function useUpdateArbitro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateArbitroSchemaType }) => {
      // Repare: Não enviamos o federation_id. A RLS do Supabase cuida da segurança!
      const { error } = await supabase
        .from('judges')
        .update(data)
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      // Atualiza a lista automaticamente na tela
      queryClient.invalidateQueries({ queryKey: ['arbitros'] });
      toast.success("Dados do árbitro atualizados!");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar", { description: error.message });
    },
  });
}