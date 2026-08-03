import { supabase } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/generate-slug";
import type { CreateBaseCategorySchemaType } from "@/schemas/base-category/create-base-category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateBaseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CreateBaseCategorySchemaType;
    }) => {
      const slug = generateSlug(data.name);
      const { error } = await supabase
        .from("base_categories")
        .update({
          modality_id: data.modality_id,
          name: data.name,
          slug,
          gender: data.gender,
        })
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["base_categories"] });
      toast.success("Categoria atualizada!");
    },
    onError: (error) =>
      toast.error("Erro ao atualizar", { description: error.message }),
  });
}
