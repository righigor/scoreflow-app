import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateFederationSchemaType } from "@/schemas/federation/create-federation-schema";
import { generateSlug } from "@/lib/utils/generate-slug";
import { supabase } from "@/lib/supabase/client";

export function useCreateFederation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      file,
    }: {
      data: CreateFederationSchemaType;
      file?: File | null;
    }) => {
      let imageUrl: string | null = null;
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

      const { error } = await supabase.from("federations").insert([
        {
          name: data.name,
          slug,
          sigla: data.sigla.toUpperCase(),
          image_url: imageUrl,
          status: data.status,
        },
      ]);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "federations"] });
      toast.success("Federação cadastrada com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao cadastrar", { description: error.message }),
  });
}
