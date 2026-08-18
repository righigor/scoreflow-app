// src/pages/club/club-configuracoes-page.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingBtn } from "@/components/buttons/loading-btn";
import { useLogout } from "@/hooks/auth/use-logout";
import { useChangePassword } from "@/hooks/auth/use-change-password";
import {
  changePasswordSchema,
  type ChangePasswordSchemaType,
} from "@/schemas/auth/change-password-schema";
import { LogOut, ShieldCheck } from "lucide-react";

export default function ClubConfiguracoesPage() {
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { mutate: changePassword, isPending: isChanging } =
    useChangePassword();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onChangePasswordSubmit = (formData: ChangePasswordSchemaType) => {
    changePassword(formData, {
      onSuccess: () => {
        reset();
        setShowPasswordForm(false);
      },
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="font-bold text-3xl">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie sua conta e preferências.
        </p>
      </div>

      {/* FEDERAÇÃO VINCULADA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Federação Vinculada
          </CardTitle>
          <CardDescription>
            Você está vinculado a uma federação. Para alterar dados da federação,
            entre em contato com o administrador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">Federação vinculada</p>
              <p className="text-sm text-muted-foreground">
                Para alterar dados da federação, entre em contato com o
                administrador.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* ALTERAR SENHA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Segurança</CardTitle>
          <CardDescription>
            Altere sua senha de acesso ao sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showPasswordForm ? (
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <p className="font-medium">Senha de acesso</p>
                <p className="text-sm text-muted-foreground">
                  Para alterar sua senha, clique no botão ao lado.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordForm(true)}
                className="text-sm text-primary hover:underline cursor-pointer"
              >
                Alterar senha
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onChangePasswordSubmit)}
              className="space-y-4 max-w-md"
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="currentPassword">
                  Senha Atual <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...register("currentPassword")}
                  placeholder="Digite sua senha atual"
                />
                {errors.currentPassword && (
                  <p className="text-xs text-destructive">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newPassword">
                  Nova Senha <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register("newPassword")}
                  placeholder="Mínimo 6 caracteres"
                />
                {errors.newPassword && (
                  <p className="text-xs text-destructive">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">
                  Confirmar Nova Senha <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Repita a nova senha"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <LoadingBtn
                  type="submit"
                  isLoading={isChanging}
                  className="cursor-pointer"
                >
                  Salvar Senha
                </LoadingBtn>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowPasswordForm(false);
                  }}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* SAIR DA CONTA */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">
            Sair da Conta
          </CardTitle>
          <CardDescription>
            Encerra sua sessão atual no dispositivo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium">Sessão ativa</p>
                <p className="text-sm text-muted-foreground">
                  Clique em sair para encerrar esta sessão.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-destructive hover:underline cursor-pointer"
            >
              Sair
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}