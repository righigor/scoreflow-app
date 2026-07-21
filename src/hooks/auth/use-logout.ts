import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";

const supabase = createClient();

export function useLogout() {
  const navigate = useNavigate();
  const clearProfile = useAuthStore((state) => state.clearProfile);

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      clearProfile();
      toast.success("Você saiu do sistema.");
      navigate("/");
    },
    onError: (error) => {
      toast.error("Erro ao sair", { description: error.message });
    },
  });
}
