import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { CreateApparatusSchemaType } from "@/schemas/apparatus/create-apparatus-schema";
import { generateSlug } from "@/lib/utils/generate-slug";

export function useUpdateApparatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data, file }: { id: string; data: CreateApparatusSchemaType; file?: File | null }) => {
      let imageUrl: string | null | undefined = undefined;
      const slug = generateSlug(data.name);

      if (file) {
        const fileName = `apparatus/${slug}-${Date.now()}.webp`;
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, file, { contentType: "image/webp", upsert: false });

        if (uploadError) throw new Error("Falha ao fazer upload da imagem.");
        
        const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const updateData: { name: string; slug: string; modality_id: string; image_url?: string | null } = {
        name: data.name,
        slug,
        modality_id: data.modality_id,
      };

      if (imageUrl !== undefined) {
        updateData.image_url = imageUrl;
      }

      const { error } = await supabase.from("apparatus").update(updateData).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apparatus"] });
      toast.success("Aparelho atualizado!");
    },
    onError: (error) => toast.error("Erro ao atualizar", { description: error.message }),
  });
}