import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import type { CreateArbitroSchemaType } from "@/schemas/arbitro/create-arbitro-schema";

const supabase = createClient();

export function useCreateArbitro() {
  const queryClient = useQueryClient();
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useMutation({
    mutationFn: async (data: CreateArbitroSchemaType) => {
      if (!federationId) throw new Error("Sem federação");
      
      const { error } = await supabase.from('judges').insert([{ 
        ...data, 
        federation_id: federationId,
        status: 'INVITED',
        active: true 
      }]);
      
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arbitros'] });
      toast.success("Árbitro convidado com sucesso!", {
        description: "Um e-mail de ativação foi enviado para ele.",
      });
    },
    onError: (error) => toast.error("Erro ao convidar", { description: error.message }),
  });
}