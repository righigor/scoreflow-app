import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { uploadImage } from "@/lib/supabase/upload-image";
import type { UpdateFederationProfileSchemaType } from "@/schemas/federation/update-federation-schema";
import { supabase } from "@/lib/supabase/client";

export function useUpdateFederationProfile() {
  const queryClient = useQueryClient();
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useMutation({
    mutationFn: async ({
      data,
      file,
    }: {
      data: UpdateFederationProfileSchemaType;
      file?: File | null;
    }) => {
      if (!federationId) throw new Error("Sem federação");

      // 1. Upload da Imagem (se tiver arquivo)
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await uploadImage(file, `federations/${federationId}`);
      }

      // 2. Atualiza Endereço (Cria se não existir)
      const addressData = {
        street: data.street || null,
        number: data.number || null,
        complement: data.complement || null,
        neighborhood: data.neighborhood || null,
        city: data.city || null,
        state: data.state || null,
        zip_code: data.zip_code || null,
      };

      const { data: existingFed } = await supabase
        .from("federations")
        .select("address_id")
        .eq("id", federationId)
        .single();

      let currentAddressId = existingFed?.address_id;

      if (currentAddressId) {
        await supabase
          .from("addresses")
          .update(addressData)
          .eq("id", currentAddressId);
      } else {
        // Gera o UUID no front — elimina a necessidade do .select() de volta
        const newAddressId = crypto.randomUUID();
        const { error: insertError } = await supabase
          .from("addresses")
          .insert({ ...addressData, id: newAddressId });
        if (insertError) throw new Error(insertError.message);
        currentAddressId = newAddressId;
      }

      // 3. Limpa dados vazios dos JSONBs
      const cleanPhones = data.phones.filter((p) => p.trim() !== "");
      const cleanSocials = Object.fromEntries(
        Object.entries(data.social_links).filter(([, val]) => val.trim() !== "")
      );

      // 4. Monta payload base
      const updatePayload = {
        name: data.name,
        sigla: data.sigla.toUpperCase(),
        contact_email: data.contact_email || null,
        cnpj: data.cnpj || null,
        foundation_date: data.foundation_date || null,
        bio: data.bio || null,
        president_name: data.president_name || null,
        president_instagram: data.president_instagram || null,
        vice_president_name: data.vice_president_name || null,
        vice_president_instagram: data.vice_president_instagram || null,
        phones: cleanPhones,
        social_links: cleanSocials,
        address_id: currentAddressId,
      };

      // 5. Atualiza a Federação (image_url só entra se existir)
      const { error } = await supabase
        .from("federations")
        .update({
          ...updatePayload,
          ...(imageUrl ? { image_url: imageUrl } : {}),
        })
        .eq("id", federationId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["federation", "profile"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao atualizar", { description: error.message }),
  });
}