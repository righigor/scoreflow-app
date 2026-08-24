import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export function useDeleteApparatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("apparatus").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "apparatus"] });
      toast.success("Aparelho excluído permanentemente.");
    },
    onError: (error) =>
      toast.error("Erro ao excluir", { description: error.message }),
  });
}
