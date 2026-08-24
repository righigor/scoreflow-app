import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import type { CreateAthleteSchemaType } from "@/schemas/athlete/create-athlete-schema";
import { supabase } from "@/lib/supabase/client";

export function useCreateAthlete() {
  const queryClient = useQueryClient();
  const clubId = useAuthStore((state) => state.profile?.club_id);

  return useMutation({
    mutationFn: async (data: CreateAthleteSchemaType) => {
      if (!clubId) throw new Error("Sem clube vinculado a este usuário.");

      const { data: newAthlete, error: athleteError } = await supabase
        .from("athletes")
        .insert([
          {
            club_id: clubId,
            name: data.name,
            cpf: data.cpf || null,
            phone: data.phone || null,
            birthdate: data.birthdate || null,
            gender: data.gender,
            instagram_url: data.instagram_url || null,
          },
        ])
        .select("id")
        .single();

      if (athleteError) {
        if (athleteError.code === "23505") {
          throw new Error(
            "Este CPF já está cadastrado no sistema para outro atleta.",
          );
        }
        throw new Error(athleteError.message);
      }

      // 2. Víncula as modalidades (Tabela N pra N)
      if (data.modalities && data.modalities.length > 0) {
        const modalitiesToInsert = data.modalities.map((modalityId) => ({
          athlete_id: newAthlete.id,
          modality_id: modalityId,
        }));

        const { error: modalityError } = await supabase
          .from("athlete_modalities")
          .insert(modalitiesToInsert);

        if (modalityError) {
          // Segurança: se falhar a modalidade, apaga o atleta para não ficar órfão
          await supabase.from("athletes").delete().eq("id", newAthlete.id);
          throw new Error("Erro ao vincular modalidades ao atleta.");
        }
      }

      return newAthlete;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      toast.success("Atleta cadastrado com sucesso!", {
        description: "O histórico de ingresso foi gerado automaticamente.",
      });
    },
    onError: (error) =>
      toast.error("Erro ao cadastrar atleta", {
        description: error.message,
      }),
  });
}
