import { supabase } from "@/lib/supabase/client";
import type { CreateCategorySchemaType } from "@/schemas/cetegory/create-category-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategorySchemaType) => {
      const { error } = await supabase.from("base_categories").insert([data]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      toast.success("Categoria cadastrada com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao cadastrar", { description: error.message }),
  });
}
