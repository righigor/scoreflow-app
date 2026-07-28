import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useConvertToWebp } from "@/hooks/use-convert-to-webp";
import type { CreateApparatusSchemaType } from "@/schemas/apparatus/create-apparatus-schema";

export function useCreateApparatus() {
  const queryClient = useQueryClient();
  const { convert } = useConvertToWebp();

  return useMutation({
    mutationFn: async (data: CreateApparatusSchemaType) => {
      let imageUrl: string | null = null;

      if (data.image_file && data.image_file instanceof File) {
        const webpFile = await convert(data.image_file);

        const fileName = `${data.slug}-${Date.now()}.webp`;
        const filePath = `apparatus/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, webpFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: "image/webp",
          });

        if (uploadError)
          throw new Error(
            "Erro ao fazer upload da imagem: " + uploadError.message,
          );

        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      const payload = {
        modality_id: data.modality_id,
        name: data.name,
        slug: data.slug,
        image_url: imageUrl,
      };

      const { error: dbError } = await supabase
        .from("apparatus")
        .insert([payload]);
      if (dbError) throw new Error(dbError.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "apparatus"] });
      toast.success("Aparelho cadastrado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar", { description: error.message });
    },
  });
}
