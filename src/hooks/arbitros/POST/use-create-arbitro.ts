// src/hooks/federacao/POST/use-create-arbitro.ts
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

      const { error: judgeError } = await supabase
        .from("judges")
        .insert([
          {
            federation_id: federationId,
            name: data.name,
            email: data.email,
            telefone: data.telefone || null,
            brevet: data.brevet,
            status: "INVITED",
            active: true,
          },
        ])
        .select("id")
        .single();

      if (judgeError) throw new Error(judgeError.message);
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