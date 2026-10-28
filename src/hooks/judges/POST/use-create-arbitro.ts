import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import type { CreateArbitroSchemaType } from "@/schemas/arbitro/create-arbitro-schema";
import { supabase } from "@/lib/supabase/client";

export function useCreateArbitro() {
  const queryClient = useQueryClient();
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useMutation({
    mutationFn: async (data: CreateArbitroSchemaType) => {
      if (!federationId) throw new Error("Sem federação");

      // 1. Insert juiz
      const { data: judge, error: judgeError } = await supabase
        .from("judges")
        .insert({
          federation_id: federationId,
          name: data.name,
          email: data.email,
          telefone: data.telefone || null,
          brevet: data.brevet,
          status: "INVITED",
          active: true,
        })
        .select("id")
        .single();

      if (judgeError) throw new Error(judgeError.message);

      // 2. Insert modalidades
      if (data.modalities.length > 0) {
        const modalityRows = data.modalities.map((mod_id) => ({
          judge_id: judge.id,
          modality_id: mod_id,
        }));

        const { error: modError } = await supabase
          .from("judge_modalities")
          .insert(modalityRows);

        if (modError) throw new Error(modError.message);
      }

      return judge.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["arbitros"] });
      toast.success("Árbitro convidado com sucesso!", {
        description: "Um e-mail de ativação foi enviado para ele.",
      });
    },
    onError: (error) =>
      toast.error("Erro ao convidar", { description: error.message }),
  });
}
