import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ModalitySchemaType } from "@/schemas/modality/modality-schema";
import { supabase } from "@/lib/supabase/client";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function useUpdateModality() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      file,
    }: {
      id: string;
      data: ModalitySchemaType;
      file?: File | null;
    }) => {
      let imageUrl: string | null | undefined = undefined;
      const slug = generateSlug(data.name);

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

      const updateData: {
        name: string;
        slug: string;
        image_url?: string | null;
      } = {
        name: data.name,
        slug,
      };

      if (imageUrl !== undefined) {
        updateData.image_url = imageUrl;
      }

      const { error } = await supabase
        .from("modalities")
        .update(updateData)
        .eq("id", id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["modalities"] });
      toast.success("Modalidade atualizada!");
    },
    onError: (error) =>
      toast.error("Erro ao atualizar", { description: error.message }),
  });
}
