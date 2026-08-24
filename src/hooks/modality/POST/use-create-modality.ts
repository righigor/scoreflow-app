import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ModalitySchemaType } from "@/schemas/modality/modality-schema";
import { supabase } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils/generate-slug";

export function useCreateModality() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      file,
    }: {
      data: ModalitySchemaType;
      file?: File | null;
    }) => {
      let imageUrl: string | null = null;
      const slug = generateSlug(data.name);

      // 1. Se enviou arquivo (já convertido para WebP pelo Sheet), faz o upload
      if (file) {
        const fileName = `modalities/${slug}-${Date.now()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, file, { contentType: "image/webp", upsert: false });

        if (uploadError) throw new Error("Falha ao fazer upload da imagem.");

        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      // 2. Salva no banco
      const { error } = await supabase
        .from("modalities")
        .insert([{ name: data.name, slug, image_url: imageUrl }]);

      if (error) {
        if (error.code === "23505")
          throw new Error("Já existe uma modalidade com esse nome.");
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modalities"] });
      toast.success("Modalidade criada com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao criar modalidade", { description: error.message }),
  });
}
