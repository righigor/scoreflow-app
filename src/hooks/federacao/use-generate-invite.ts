import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";

export function useGenerateInvite() {
  const queryClient = useQueryClient();
  const federationId = useAuthStore((state) => state.profile?.federation_id);

  return useMutation({
    mutationFn: async () => {
      if (!federationId) throw new Error("Sem federação");

      const token = crypto.randomUUID(); 

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase.from("federation_invites").insert([{
        federation_id: federationId,
        token: token,
        expires_at: expiresAt.toISOString(),
      }]);

      if (error) throw new Error(error.message);

      return token;
    },
    onSuccess: (token) => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });

      const inviteLink = `${window.location.origin}/inscrever-clube?token=${token}`;
      navigator.clipboard.writeText(inviteLink);
      
      toast.success("Link gerado e copiado!", {
        description: "O link é válido por 7 dias e pode ser enviado para múltiplos clubes.",
      });
    },
    onError: (error) => {
      toast.error("Erro ao gerar link", { description: error.message });
    },
  });
}