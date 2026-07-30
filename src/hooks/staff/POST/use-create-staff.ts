import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import type { CreateStaffSchemaType } from "@/schemas/staff/create-staff-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export function useCreateStaff() {
  const queryClient = useQueryClient();
  const clubId = useAuthStore((state) => state.profile?.club_id);

  return useMutation({
    mutationFn: async (data: CreateStaffSchemaType) => {
      if (!clubId) throw new Error("Sem clube vinculado a este usuário.");

      const { data: newStaff, error: staffError } = await supabase
        .from("staff")
        .insert([
          {
            club_id: clubId,
            staff_role_id: data.staff_role_id,
            name: data.name,
            cpf: data.cpf || null,
            phone: data.phone || null,
            gender: data.gender,
            instagram_url: data.instagram_url || null,
          },
        ])
        .select("id")
        .single();

      if (staffError) {
        if (staffError.code === "23505") {
          throw new Error(
            "Este CPF já está cadastrado no sistema para outro membro.",
          );
        }
        throw new Error(staffError.message);
      }

      if (data.modalities && data.modalities.length > 0) {
        const modalitiesToInsert = data.modalities.map((modalityId) => ({
          staff_id: newStaff.id,
          modality_id: modalityId,
        }));

        const { error: modalityError } = await supabase
          .from("staff_modalities")
          .insert(modalitiesToInsert);

        if (modalityError) {
          await supabase.from("staff").delete().eq("id", newStaff.id);
          throw new Error("Erro ao vincular modalidades.");
        }
      }

      return newStaff;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Membro adicionado com sucesso!", {
        description: "O histórico de ingresso foi gerado automaticamente.",
      });
    },
    onError: (error) =>
      toast.error("Erro ao adicionar membro", {
        description: error.message,
      }),
  });
}
