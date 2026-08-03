import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateProfileName() {
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);

  return useMutation({
    mutationFn: async (newName: string) => {
      if (!profile?.id) throw new Error("Usuário não logado.");

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: newName })
        .eq("id", profile.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_data, newName) => {
      if (profile) {
        setProfile({ ...profile, full_name: newName });
      }
      toast.success("Nome atualizado com sucesso!");
    },
    onError: (error) => toast.error("Erro ao atualizar nome", {
      description: error.message,
    }),
  });
}