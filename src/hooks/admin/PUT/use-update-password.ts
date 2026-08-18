import { supabase } from "@/lib/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
    },
    onError: (error) =>
      toast.error("Erro ao alterar senha", {
        description: error.message,
      }),
  });
}
