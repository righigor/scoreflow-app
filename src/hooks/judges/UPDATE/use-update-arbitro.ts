import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { UpdateArbitroSchemaType } from "@/schemas/arbitro/update-arbitro-schema";

const supabase = createClient();

export function useUpdateArbitro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateArbitroSchemaType;
    }) => {
      // 1. Update dados do juiz
      const { error } = await supabase
        .from("judges")
        .update({
          name: data.name,
          email: data.email,
          telefone: data.telefone || null,
          brevet: data.brevet,
        })
        .eq("id", id);

      if (error) throw new Error(error.message);

      // 2. Deletar modalidades antigas
      await supabase.from("judge_modalities").delete().eq("judge_id", id);

      // 3. Inserir novas modalidades
      if (data.modalities && data.modalities.length > 0) {
        const rows = data.modalities.map((modalityId) => ({
          judge_id: id,
          modality_id: modalityId,
        }));

        const { error: modError } = await supabase
          .from("judge_modalities")
          .insert(rows);

        if (modError) throw new Error(modError.message);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arbitros"] });
      queryClient.invalidateQueries({ queryKey: ["judge", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["judge_modalities"] });
      toast.success("Dados do árbitro atualizados!");
    },
    onError: (error) =>
      toast.error("Erro ao atualizar", { description: error.message }),
  });
}
