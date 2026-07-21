import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; // <-- Importei o toast
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { LoginValues } from "@/zod/login/login-schema";

const supabase = createClient();

export function useLogin() {
  const navigate = useNavigate();
  const setProfile = useAuthStore((state) => state.setProfile);

  return useMutation({
    mutationFn: async (credentials: LoginValues) => {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

      if (authError) {
        throw new Error(
          authError.message === "Invalid login credentials"
            ? "E-mail ou senha incorretos."
            : authError.message,
        );
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (profileError) {
        throw new Error("Perfil de usuário não encontrado. Contate o suporte.");
      }

      setProfile(profileData);
      return profileData;
    },
    onSuccess: (profile) => {
      toast.success(`Bem-vindo ao ScoreFlow!`, {
        description: "Redirecionando para o seu painel...",
      });
      setTimeout(() => {
        switch (profile.role) {
          case "FEDERATION_ADMIN":
            navigate("/federation");
            break;
          case "CLUB_ADMIN":
            navigate("/club");
            break;
          case "JUDGE":
            navigate("/scoring");
            break;
          default:
            navigate("/unauthorized");
        }
      }, 800);
    },
    onError: (error) => {
      toast.error("Erro ao fazer login", {
        description: error.message,
      });
    },
  });
}
