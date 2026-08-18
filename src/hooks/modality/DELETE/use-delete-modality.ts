import { supabase } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteModality() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("modalities").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modalities"] });
      toast.success("Modalidade excluída permanentemente.");
    },
    onError: (error) =>
      toast.error("Erro ao excluir", { description: error.message }),
  });
}
