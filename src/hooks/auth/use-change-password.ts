import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import type { ChangePasswordSchemaType } from "@/schemas/auth/change-password-schema";

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordSchemaType) => {
      // 1. Verifica a senha atual usando signIn (não expõe endpoint separado)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        await supabase.auth.signOut();
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });

      if (verifyError) {
        // Sign-in bem sucedido precisa fazer logout para não duplicar sessão
        await supabase.auth.signOut();
        throw new Error("Senha atual incorreta.");
      }

      // 2. Faz logout da sessão temporária
      await supabase.auth.signOut();

      // 3. Atualiza a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) throw new Error(updateError.message);
    },
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!", {
        description: "Faça login novamente com a nova senha.",
      });
    },
    onError: (error) => {
      toast.error("Erro ao alterar senha", {
        description: error.message,
      });
    },
  });
}