import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { CreateApparatusSchemaType } from "@/schemas/apparatus/create-apparatus-schema";
import { generateSlug } from "@/lib/utils/generate-slug";

export function useCreateApparatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      file,
    }: {
      data: CreateApparatusSchemaType;
      file?: File | null;
    }) => {
      let imageUrl: string | null = null;
      const slug = generateSlug(data.name);

      if (file) {
        const fileName = `apparatus/${slug}-${Date.now()}.webp`;
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, file, { contentType: "image/webp", upsert: false });

        if (uploadError) throw new Error("Falha ao fazer upload da imagem.");

        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("apparatus").insert([
        {
          modality_id: data.modality_id,
          name: data.name,
          slug,
          image_url: imageUrl,
        },
      ]);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apparatus"] });
      toast.success("Aparelho cadastrado com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao cadastrar", { description: error.message }),
  });
}
