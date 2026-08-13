import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { uploadImage } from "@/lib/supabase/upload-image";
import type { UpdateJudgeProfileSchemaType } from "@/schemas/arbitro/update-judge-profile-schema";
import { supabase } from "@/lib/supabase/client";

export function useUpdateJudgeProfile() {
  const queryClient = useQueryClient();
  const judgeId = useAuthStore((state) => state.profile?.judge_id);

  return useMutation({
    mutationFn: async ({
      data,
      file,
    }: {
      data: UpdateJudgeProfileSchemaType;
      file?: File | null;
    }) => {
      if (!judgeId) throw new Error("Sem juiz vinculado");

      // 1. Upload da imagem
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await uploadImage(file, `judges/${judgeId}`);
      }

      // 2. Atualiza dados pessoais na tabela judges
      const judgePayload = {
        name: data.name,
        email: data.email,
        ...(imageUrl ? { image_url: imageUrl } : {}),
      };

      const { error: judgeError } = await supabase
        .from("judges")
        .update(judgePayload)
        .eq("id", judgeId);

      if (judgeError) throw new Error(judgeError.message);

      // 3. Atualiza dados financeiros na tabela judge_profile
      const profilePayload = {
        cpf: data.cpf || null,
        pis: data.pis || null,
        phone: data.phone || null,
        bank: data.bank || null,
        bank_branch: data.bank_branch || null,
        bank_account: data.bank_account || null,
        pix_key: data.pix_key || null,
      };

      const { error: profileError } = await supabase
        .from("judge_profile")
        .update(profilePayload)
        .eq("judge_id", judgeId);

      if (profileError) throw new Error(profileError.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["judge", "profile"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao atualizar", { description: error.message }),
  });
}