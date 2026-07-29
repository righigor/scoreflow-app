import { supabase } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export function useUpdateClubStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clubId, newStatus }: { clubId: string, newStatus: 'ACTIVE' | 'INACTIVE' }) => {
      const { error } = await supabase
        .from('clubs')
        .update({ status: newStatus })
        .eq('id', clubId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['federation', 'clubs'] });
      toast.success("Status do clube atualizado!");
    },
    onError: (error) => toast.error("Erro ao atualizar", { description: error.message }),
  });
}