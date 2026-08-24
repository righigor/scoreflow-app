import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // Importe o checkbox do shadcn
import {
  registerClubSchema,
  type RegisterClubSchemaType,
} from "@/schemas/club/register-club-schema";
import { useGetModalities } from "@/hooks/modality/GET/use-get-modalities";
import { supabase } from "@/lib/supabase/client";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import { useAuthStore } from "@/stores/auth-store";

export default function RegisterClubPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { data: modalities } = useGetModalities();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterClubSchemaType>({
    resolver: zodResolver(registerClubSchema),
    defaultValues: { modalities: [] },
  });

  const [isLoading, setIsLoading] = useState(false);

  const selectedModalities = watch("modalities");

  const handleToggleModality = (modId: string) => {
    const current = selectedModalities || [];
    if (current.includes(modId)) {
      setValue(
        "modalities",
        current.filter((id) => id !== modId),
      );
    } else {
      setValue("modalities", [...current, modId]);
    }
  };

  const onSubmit = async (data: RegisterClubSchemaType) => {
    if (!token) return toast.error("Token de convite não encontrado na URL.");
    setIsLoading(true);

    try {
      // 1. Cria a conta. Como o "Confirm Email" está desligado,
      // o usuário JÁ fica logado automaticamente aqui!
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw new Error(authError.message);
      if (!authData.user) throw new Error("Erro ao criar usuário no servidor.");

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      // Força a atualização do estado global imediatamente
      if (profile) {
        useAuthStore.getState().setProfile(profile);
      }

      // 2. Chama nossa função para criar o perfil e o clube no banco
      const response = await supabase.rpc("register_club_with_invite", {
        p_user_id: authData.user.id,
        p_token: token,
        p_name: data.name,
        p_short_name: data.short_name,
        p_sigla: data.sigla,
        p_modalities: data.modalities,
      });

      if (response.error) throw new Error(response.error.message);

      const result = response.data as { error?: string; success?: boolean };
      if (result?.error) throw new Error(result.error);

      // 3. Sucesso! Já podemos redirecionar (não precisa de signInWithPassword)
      toast.success("Clube cadastrado! Aguardando aprovação da Federação.");
      navigate("/equipe");
    } catch (err: unknown) {
      await supabase.auth.signOut(); // Limpa a conta se der erro no banco
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Erro ao realizar cadastro.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-destructive font-medium">
          Link de convite inválido (faltando o token).
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <div className="w-full max-w-lg rounded-xl border p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Cadastro de Clube
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Preencha os dados do seu clube para iniciar o processo de filiação.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label>Nome Completo do Clube</Label>
              <Input
                placeholder="Escola de Ginástica Exemplo"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Nome Curto</Label>
              <Input placeholder="Gin. Exemplo" {...register("short_name")} />
              {errors.short_name && (
                <p className="text-xs text-destructive">
                  {errors.short_name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Sigla</Label>
              <Input placeholder="EGX" {...register("sigla")} />
              {errors.sigla && (
                <p className="text-xs text-destructive">
                  {errors.sigla.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>E-mail Institucional</Label>
            <Input
              type="email"
              placeholder="contato@clube.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Senha</Label>
              <Input type="password" {...register("password")} />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Confirmar Senha</Label>
              <Input type="password" {...register("passwordConfirm")} />
              {errors.passwordConfirm && (
                <p className="text-xs text-destructive">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Label>Modalidades Praticadas</Label>
            <div className="grid grid-cols-2 gap-2">
              {modalities &&
                modalities.map((mod) => (
                  <label
                    key={mod.id}
                    className="flex items-center gap-2 text-sm rounded-md border p-3 cursor-pointer hover:bg-accent transition-colors"
                  >
                    <Checkbox
                      checked={selectedModalities?.includes(mod.id)}
                      onCheckedChange={() => handleToggleModality(mod.id)}
                    />
                    <span>{mod.name}</span>
                  </label>
                ))}
            </div>
            {errors.modalities && (
              <p className="text-xs text-destructive">
                {errors.modalities.message}
              </p>
            )}
          </div>

          <LoadingBtn
            isLoading={isLoading}
            type="submit"
            className="w-full cursor-pointer mt-4"
          >
            Cadastrar e Aguardar Aprovação
          </LoadingBtn>
        </form>
      </div>
    </div>
  );
}
