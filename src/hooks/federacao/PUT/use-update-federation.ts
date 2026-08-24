import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateFederationSchemaType } from "@/schemas/federation/create-federation-schema";
import { generateSlug } from "@/lib/utils/generate-slug";
import { supabase } from "@/lib/supabase/client";

export function useUpdateFederation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      file,
    }: {
      id: string;
      data: CreateFederationSchemaType;
      file?: File | null;
    }) => {
      let imageUrl: string | null | undefined = undefined;
      const slug = generateSlug(data.name);

      if (file) {
        const fileName = `federations/${slug}-${Date.now()}.webp`;
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, file, { contentType: "image/webp", upsert: false });

        if (uploadError) throw new Error("Falha ao fazer upload da logo.");

        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const updateData: {
        name: string;
        slug: string;
        sigla: string;
        status: string;
        image_url?: string | null;
      } = {
        name: data.name,
        slug,
        sigla: data.sigla.toUpperCase(),
        status: data.status,
      };

      if (imageUrl !== undefined) {
        updateData.image_url = imageUrl;
      }

      const { error } = await supabase
        .from("federations")
        .update(updateData)
        .eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "federations"] });
      toast.success("Federação atualizada!");
    },
    onError: (error) =>
      toast.error("Erro ao atualizar", { description: error.message }),
  });
}
