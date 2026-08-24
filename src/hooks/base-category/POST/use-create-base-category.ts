import { supabase } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/generate-slug";
import type { CreateBaseCategorySchemaType } from "@/schemas/base-category/create-base-category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateBaseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBaseCategorySchemaType) => {
      const slug = generateSlug(data.name);
      const { error } = await supabase.from("base_categories").insert([
        {
          modality_id: data.modality_id,
          name: data.name,
          slug,
          gender: data.gender,
        },
      ]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["base_categories"] });
      toast.success("Categoria criada com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao criar", { description: error.message }),
  });
}
