import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export const useToggleArbitroStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      arbitroId, 
      active 
    }: { 
      arbitroId: string; 
      active: boolean; 
    }) => {
      // O Supabase RLS garante que só vai atualizar se o árbitro 
      // pertencer à federação do usuário logado no momento!
      const { error } = await supabase
        .from('judges')
        .update({ active: !active })
        .eq('id', arbitroId);

      if (error) throw new Error(error.message);
      
      return !active; // Retorna o novo status
    },

    onSuccess: (newStatus) => {
      // Invalida a lista. Não precisa mais do federacaoId no array da chave!
      // Ele vai procurar qualquer query que comece com 'arbitros' e atualizar.
      queryClient.invalidateQueries({ queryKey: ["arbitros"] });
      
      const msg = newStatus ? "Árbitro ativado!" : "Árbitro desativado!";
      toast.success(msg);
    },
    onError: (error) => {
      console.error("Erro ao alterar status:", error);
      toast.error("Não foi possível alterar o status do árbitro.", {
        description: error.message,
      });
    },
  });
};