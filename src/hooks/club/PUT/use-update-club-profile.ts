import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { uploadImage } from "@/lib/supabase/upload-image";
import type { UpdateClubProfileSchemaType } from "@/schemas/club/update-club-profile-schema";
import { supabase } from "@/lib/supabase/client";

export function useUpdateClubProfile() {
  const queryClient = useQueryClient();
  const clubId = useAuthStore((state) => state.profile?.club_id);

  return useMutation({
    mutationFn: async ({
      data,
      file,
    }: {
      data: UpdateClubProfileSchemaType;
      file?: File | null;
    }) => {
      if (!clubId) throw new Error("Sem clube vinculado");

      // 1. Upload da Imagem (se tiver arquivo)
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await uploadImage(file, `clubs/${clubId}`);
      }

      // --- NOVA LÓGICA DE ENDEREÇO ---
      // Verifica se o usuário preencheu AO MENOS um campo de endereço
      const hasAddressData = [
        data.street, data.number, data.complement, 
        data.neighborhood, data.city, data.state, data.zip_code
      ].some(field => field && field.trim() !== "");

      let currentAddressId: string | null = null;

      if (hasAddressData) {
        const addressData = {
          street: data.street || null,
          number: data.number || null,
          complement: data.complement || null,
          neighborhood: data.neighborhood || null,
          city: data.city || null,
          state: data.state || null,
          zip_code: data.zip_code || null,
        };

        const { data: existingClub } = await supabase
          .from("clubs")
          .select("address_id")
          .eq("id", clubId)
          .single();

        currentAddressId = existingClub?.address_id || null;

        if (currentAddressId) {
          // Se já tem endereço, atualiza
          await supabase
            .from("addresses")
            .update(addressData)
            .eq("id", currentAddressId);
        } else {
          // Se não tem, cria um novo
          const newAddressId = crypto.randomUUID();
          const { error: insertError } = await supabase
            .from("addresses")
            .insert({ ...addressData, id: newAddressId });
          if (insertError) throw new Error(insertError.message);
          currentAddressId = newAddressId;
        }
      }
      // --- FIM DA LÓGICA DE ENDEREÇO ---

      // 3. Limpa dados vazios dos JSONBs
      const cleanPhones = data.phones.filter((p) => p.trim() !== "");
      const cleanSocials = Object.fromEntries(
        Object.entries(data.social_links).filter(([, val]) => val.trim() !== "")
      );

      // 4. Monta payload base
      const updatePayload = {
        name: data.name,
        short_name: data.short_name,
        sigla: data.sigla.toUpperCase(),
        email: data.email,
        contact_email: data.contact_email || null,
        cnpj: data.cnpj || null,
        foundation_date: data.foundation_date || null,
        bio: data.bio || null,
        instagram_url: data.instagram_url || null,
        primary_color: data.primary_color || null,
        secondary_color: data.secondary_color || null,
        president_name: data.president_name || null,
        president_instagram: data.president_instagram || null,
        vice_president_name: data.vice_president_name || null,
        vice_president_instagram: data.vice_president_instagram || null,
        phones: cleanPhones,
        social_links: cleanSocials,
        // Só vincula o address_id se algum dado de endereço foi preenchido
        address_id: hasAddressData ? currentAddressId : null, 
      };

      // 5. Atualiza o Clube
      const { error } = await supabase
        .from("clubs")
        .update({
          ...updatePayload,
          ...(imageUrl ? { image_url: imageUrl } : {}),
        })
        .eq("id", clubId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao atualizar", { description: error.message }),
  });
}